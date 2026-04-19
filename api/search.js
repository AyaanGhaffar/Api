export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q, source = 'all', safe = 'true' } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  const isSafe = safe === 'true';
  const results = [];

  try {
    // 1. YouTube Search (via Piped API)
    if (source === 'youtube' || source === 'all') {
      try {
        const ytReq = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(q)}&filter=videos`);
        if (ytReq.ok) {
          const ytData = await ytReq.json();
          if (ytData && ytData.items) {
            results.push(...ytData.items.slice(0, 6).map(v => ({
              title: v.title,
              thumbnail: v.thumbnail,
              duration: v.duration + 's',
              source: 'youtube.com',
              originalUrl: `https://youtube.com${v.url}`,
              formats: [
                { quality: "1080p", size: "Unknown", type: "MP4" },
                { quality: "720p", size: "Unknown", type: "MP4" },
                { quality: "Audio", size: "Unknown", type: "MP3" }
              ]
            })));
          }
        }
      } catch (e) {
        console.error('YouTube search failed:', e);
      }
    }

    // 2. Adult Search (Eporner Open API fallback)
    if (!isSafe && (source === 'all' || source === 'pornhub' || source === 'xhamster')) {
      try {
        const epReq = await fetch(`https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(q)}&per_page=6`);
        if (epReq.ok) {
          const epData = await epReq.json();
          if (epData && epData.videos) {
            results.push(...epData.videos.map(v => ({
              title: v.title,
              thumbnail: v.default_thumb?.src,
              previewUrl: v.preview,
              duration: v.length_min + ' min',
              source: 'eporner.com',
              originalUrl: v.url,
              formats: [
                { quality: "1080p", size: "Unknown", type: "MP4" },
                { quality: "720p", size: "Unknown", type: "MP4" }
              ]
            })));
          }
        }
      } catch (e) {
        console.error('Adult search failed:', e);
      }
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
