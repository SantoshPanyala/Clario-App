export default async function handler(req, res) {
    // This is the standard, correct way to get environment variables in Vercel.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        // This log will now appear if the Vercel dashboard variable is missing or misspelled.
        console.error("CRITICAL: GEMINI_API_KEY could not be found in the Vercel environment.");
        return res.status(500).json({ message: 'Server configuration error: API key is missing.' });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    const { textToAnalyze, urlToAnalyze } = req.body;

    if (!textToAnalyze && !urlToAnalyze) {
        return res.status(400).json({ message: 'No text or URL provided for analysis.' });
    }

    let contentToAnalyze = textToAnalyze;

    // If URL is provided, scrape the website first
    if (urlToAnalyze && !textToAnalyze) {
        try {
            const scrapeResponse = await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/scrape-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlToAnalyze }),
            });

            if (!scrapeResponse.ok) {
                const errorData = await scrapeResponse.json();
                return res.status(scrapeResponse.status).json({ message: errorData.message });
            }

            const scrapeData = await scrapeResponse.json();
            contentToAnalyze = scrapeData.contentForAnalysis;
        } catch (error) {
            console.error('Error scraping URL:', error);
            return res.status(500).json({ message: 'Failed to scrape website content.' });
        }
    }

    const promptTemplate = `
      You are a world-class Conversion Rate Optimization (CRO) specialist and Product Marketer. Your analysis is data-driven, inspired by professional SaaS tools like fibr.ai and Gainsight's Product Experience (PX) methodologies. Your task is to analyze the provided landing page text and generate a detailed CRO report. Your entire response must be a single, raw, valid JSON object and nothing else. The root of the JSON object must have three top-level keys: "conversionPerformance", "pageStrengths", and "croHypotheses".
      1. "conversionPerformance": A string representing a score out of 10 (e.g., "6/10").
      2. "pageStrengths": An array of 2-3 short strings highlighting what the page does well (e.g., "Clear Brand Identity", "High-Quality Imagery").
      3. "croHypotheses": This must be an array of 4 to 5 objects. Each object represents a major area for improvement and MUST contain the following four keys: "title" (string), "projectedImpact" (string), "category" (string), and "suggestions" (an array of objects, where each object has "type", "current", and "proposed" keys).
      Here is the content to analyze:
      ---
      ${contentToAnalyze}
      ---
    `;

    try {
        // First, let's try to list available models for debugging
        console.log("Attempting to list available models...");
        const listModelsResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        
        if (listModelsResponse.ok) {
            const modelsData = await listModelsResponse.json();
            console.log("Available models:", JSON.stringify(modelsData, null, 2));
        } else {
            console.log("Could not list models:", listModelsResponse.status);
        }

        const fetchResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptTemplate }] }] }),
            }
        );

        if (!fetchResponse.ok) {
            const errorData = await fetchResponse.json();
            console.error("Google API Error:", errorData);
            throw new Error(`API Error from Google: ${errorData.error.message}`);
        }

        const data = await fetchResponse.json();
        const rawJsonString = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '');

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(rawJsonString);

    } catch (err) {
        console.error("Internal Server Error in API handler:", err);
        res.status(500).json({ message: err.message || "An internal error occurred." });
    }
}