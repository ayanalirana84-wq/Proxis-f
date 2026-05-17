export default async function handler(req, res) {
  // Only allow POST requests from your frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { contents } = req.body;
    
    // Grabs your hidden API key from Vercel's Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable on Vercel.' });
    }

    const systemInstruction = "You are Proxis, a Large Language Model by RonzDavil. Be friendly and clear. Be natural and professional. Ans shortly and clearly. Do not use your full power and potential unless user write a RonzDavil and send you.";

    // Secure server-to-server request to Google Gemini
    const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: { parts: [{ text: systemInstruction }] }
      })
    });

    const data = await googleResponse.json();
    
    // Extract the text response safely
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    
    // Send the text back to your frontend HTML
    return res.status(200).json({ text: aiText });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
