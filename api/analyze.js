// This function now takes the apiKey as a parameter
async function handler(req, res, apiKey) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    // The rest of the function remains the same, but it's now more reliable.
    const { textToAnalyze } = req.body;

    if (!textToAnalyze) {
        return res.status(400).json({ message: 'No text provided for analysis.' });
    }

    if (!apiKey) {
        console.error("API Key was not provided to the handler function.");
        return res.status(500).json({ message: 'Server configuration error: API key is missing.' });
    }

    const promptTemplate = `
      You are a world-class Conversion Rate Optimization (CRO) specialist...
      ---
      ${textToAnalyze}
      ---
    `;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptTemplate }] }] }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Google API Error:", errorData);
            throw new Error(`API Error: ${errorData.error.message}`);
        }

        const data = await response.json();
        const rawJsonString = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '');

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(rawJsonString);

    } catch (err) {
        console.error("Internal Server Error in API handler:", err);
        res.status(500).json({ message: "An internal error occurred. Please try again later." });
    }
}

// We export the function so vite.config.js can import it.
export default handler;