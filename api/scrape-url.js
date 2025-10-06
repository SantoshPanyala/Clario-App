import * as cheerio from 'cheerio';
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'No URL provided for scraping.' });
    }

    // Validate URL format
    try {
        new URL(url);
    } catch (error) {
        return res.status(400).json({ message: 'Invalid URL format.' });
    }

    try {
        // Fetch the webpage
        const response = await axios.get(url, {
            timeout: 10000, // 10 second timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            maxRedirects: 5
        });

        const $ = cheerio.load(response.data);

        // Extract key content for CRO analysis
        const scrapedData = {
            title: $('title').text().trim() || 'No title found',
            description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || 'No description found',
            h1: $('h1').map((i, el) => $(el).text().trim()).get().filter(text => text.length > 0),
            h2: $('h2').map((i, el) => $(el).text().trim()).get().filter(text => text.length > 0),
            h3: $('h3').map((i, el) => $(el).text().trim()).get().filter(text => text.length > 0),
            
            // Extract main content paragraphs
            paragraphs: $('p').map((i, el) => $(el).text().trim()).get()
                .filter(text => text.length > 20) // Only paragraphs with substantial content
                .slice(0, 10), // Limit to first 10 paragraphs
            
            // Extract button text and CTAs
            buttons: $('button, input[type="submit"], .btn, .button, [role="button"]')
                .map((i, el) => $(el).text().trim()).get()
                .filter(text => text.length > 0 && text.length < 50),
            
            // Extract links (especially those that look like CTAs)
            links: $('a').map((i, el) => {
                const text = $(el).text().trim();
                const href = $(el).attr('href');
                return { text, href };
            }).get()
                .filter(link => link.text.length > 0 && link.text.length < 100)
                .slice(0, 20), // Limit to first 20 links
            
            // Extract form elements
            forms: $('form').map((i, el) => {
                const form = $(el);
                return {
                    action: form.attr('action') || '',
                    method: form.attr('method') || 'GET',
                    inputs: form.find('input, textarea, select').map((j, input) => ({
                        type: $(input).attr('type') || 'text',
                        name: $(input).attr('name') || '',
                        placeholder: $(input).attr('placeholder') || ''
                    })).get()
                };
            }).get(),
            
            // Extract social proof elements
            testimonials: $('.testimonial, .review, [class*="testimonial"], [class*="review"]')
                .map((i, el) => $(el).text().trim()).get()
                .filter(text => text.length > 20 && text.length < 500)
                .slice(0, 5),
            
            // Extract pricing information
            pricing: $('[class*="price"], [class*="pricing"], [class*="cost"]')
                .map((i, el) => $(el).text().trim()).get()
                .filter(text => text.length > 0 && text.length < 100)
                .slice(0, 10),
            
            // Extract trust signals
            trustSignals: $('[class*="trust"], [class*="secure"], [class*="certified"], [class*="guarantee"]')
                .map((i, el) => $(el).text().trim()).get()
                .filter(text => text.length > 0 && text.length < 200)
                .slice(0, 10),
            
            url: url,
            scrapedAt: new Date().toISOString()
        };

        // Create a comprehensive text summary for AI analysis
        const contentForAnalysis = `
Website Analysis for: ${url}

TITLE: ${scrapedData.title}
DESCRIPTION: ${scrapedData.description}

HEADLINES:
H1: ${scrapedData.h1.join(' | ')}
H2: ${scrapedData.h2.join(' | ')}
H3: ${scrapedData.h3.join(' | ')}

MAIN CONTENT:
${scrapedData.paragraphs.join('\n\n')}

CALL-TO-ACTION BUTTONS:
${scrapedData.buttons.join(' | ')}

IMPORTANT LINKS:
${scrapedData.links.map(link => `${link.text} (${link.href})`).join('\n')}

FORMS FOUND:
${scrapedData.forms.map(form => `Action: ${form.action}, Method: ${form.method}, Inputs: ${form.inputs.map(input => input.type).join(', ')}`).join('\n')}

SOCIAL PROOF/TESTIMONIALS:
${scrapedData.testimonials.join('\n\n')}

PRICING INFORMATION:
${scrapedData.pricing.join(' | ')}

TRUST SIGNALS:
${scrapedData.trustSignals.join(' | ')}
        `.trim();

        res.status(200).json({
            success: true,
            scrapedData,
            contentForAnalysis,
            message: 'Website content successfully scraped and prepared for analysis'
        });

    } catch (error) {
        console.error('Error scraping URL:', error);
        
        if (error.code === 'ENOTFOUND') {
            return res.status(400).json({ message: 'Website not found. Please check the URL and try again.' });
        } else if (error.code === 'ECONNABORTED') {
            return res.status(408).json({ message: 'Request timeout. The website took too long to respond.' });
        } else if (error.response?.status === 403) {
            return res.status(403).json({ message: 'Access denied. This website blocks automated requests.' });
        } else if (error.response?.status === 404) {
            return res.status(404).json({ message: 'Website not found (404 error).' });
        } else {
            return res.status(500).json({ message: 'Failed to scrape website. Please try again or contact support.' });
        }
    }
}
