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

    const { textToAnalyze } = req.body;

    if (!textToAnalyze) {
        return res.status(400).json({ message: 'No text provided for analysis.' });
    }

    const promptTemplate = `
      You are a world-class Conversion Rate Optimization (CRO) specialist...
      ---
      ${textToAnalyze}
      ---
    `;

    try {
        const fetchResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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