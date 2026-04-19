export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace('www.', '');

    let videoData = {
      title: "Extracted Video from " + hostname,
      thumbnail: "https://via.placeholder.com/640x360",
      duration: "Unknown",
      source: hostname,
      originalUrl: url,
      formats: [
        { quality: "1080p", size: "Unknown", type: "MP4" },
        { quality: "Audio", size: "Unknown", type: "MP3" }
      ]
    };

    // YouTube Metadata Extraction
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId = parsedUrl.searchParams.get("v");
      if (!videoId && hostname.includes("youtu.be")) {
        videoId = parsedUrl.pathname.slice(1);
      }
      
      if (videoId) {
        const ytReq = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        if (ytReq.ok) {
          const v = await ytReq.json();
          videoData.title = v.title;
          videoData.thumbnail = v.videoThumbnails?.find(t => t.quality === 'medium')?.url || v.videoThumbnails?.[0]?.url;
          videoData.duration = v.lengthSeconds + 's';
        }
      }
    }

    res.status(200).json({ video: videoData });
  } catch (error) {
    console.error('Extraction Error:', error);
    res.status(500).json({ error: 'Failed to extract video data' });
  }
      }
