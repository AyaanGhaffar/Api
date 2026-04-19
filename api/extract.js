import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' }
    });

    const $ = cheerio.load(data);
    
    // Extracting standard Open Graph meta tags
    const pageData = {
      title: $('meta[property="og:title"]').attr('content') || $('title').text(),
      image: $('meta[property="og:image"]').attr('content'),
      description: $('meta[property="og:description"]').attr('content'),
      originalUrl: url
    };

    res.status(200).json({ data: pageData });
  } catch (error) {
    res.status(500).json({ error: 'Extraction process failed', details: error.message });
  }
}
