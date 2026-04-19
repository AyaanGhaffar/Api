import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Search query is required' });

  try {
    // Replace with the target search URL
    const searchUrl = `https://example.com{encodeURIComponent(q)}`;
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' }
    });

    const $ = cheerio.load(data);
    const results = [];

    // Use CSS selectors specific to the target site's structure
    $('.result-item').each((i, el) => {
      const title = $(el).find('.title-selector').text().trim();
      const link = $(el).find('a').attr('href');
      const image = $(el).find('img').attr('src');

      if (title && link) {
        results.push({ title, link, image });
      }
    });

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Search process failed', details: error.message });
  }
}
