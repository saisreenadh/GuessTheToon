// server.js
const express = require('express');
const cors = require('cors');
const openai = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

openai.apiKey = process.env.OPENAI_API_KEY;

app.post('/get-cartoon', async (req, res) => {
    try {
        const response = await openai.Completion.create({
            engine: 'text-davinci-003',
            prompt: 'Generate a fictional cartoon title and a fun hint for it.',
            max_tokens: 50,
        });
        const result = response.choices[0].text.trim().split("\n");
        res.json({
            title: result[0].trim(),
            hint: result[1].trim()
        });
    } catch (error) {
        console.error("Error generating cartoon:", error);
        res.status(500).json({ error: 'Error generating cartoon' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
