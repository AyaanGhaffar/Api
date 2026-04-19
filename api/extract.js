```javascript
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

    // Restrict to Pornhub only
    if (!hostname.includes('pornhub.com')) {
      return res.status(400).json({ error: 'Only Pornhub URLs are supported' });
    }

    const viewkey = parsedUrl.searchParams.get("viewkey");

    if (!viewkey) {
      return res.status(400).json({ error: 'Invalid URL: viewkey is missing' });
    }

    let videoData = {
      title: "Extracted Video from Pornhub",
      thumbnail: "https://via.placeholder.com/640x360",
      duration: "Unknown",
      source: "pornhub.com",
      originalUrl: url,
      formats: [
        { quality: "1080p", size: "Unknown", type: "MP4" },
        { quality: "720p", size: "Unknown", type: "MP4" }
      ]
    };

    // TODO: Insert your actual scraping logic here.
    // Example: Use 'yt-dlp' via child_process or a dedicated npm scraper package 
    // to fetch the real video metadata and direct MP4 URLs using the viewkey.

    res.status(200).json({ video: videoData });
  } catch (error) {
    console.error('Extraction Error:', error);
    res.status(500).json({ error: 'Failed to extract video data' });
  }
}
```
