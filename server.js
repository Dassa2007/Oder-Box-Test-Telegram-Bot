const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const TELEGRAM_BOT_TOKEN = '8984933024:AAG_b9I-oCIvZNyeV-UiH5McnvMkzaNaolY';
const TELEGRAM_CHAT_ID = '8303305317';

app.post('/api/order', upload.single('receipt'), async (req, res) => {
    try {
        const { name, packageName, duration, price } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'Receipt image is required!' });
        }

        const caption = `🔥 **NEW DG STORE ORDER!** 🔥\n\n` +
                        `👤 **Customer:** ${name}\n` +
                        `📦 **Package:** ${packageName}\n` +
                        `⏱️ **Plan:** ${duration}\n` +
                        `💰 **Price:** ${price}`;

        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('photo', imageFile.buffer, { filename: imageFile.originalname });
        formData.append('caption', caption);
        formData.append('parse_mode', 'Markdown');

        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
            formData,
            { headers: { ...formData.getHeaders() } }
        );

        res.json({ success: true, message: 'Order sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error occurred.' });
    }
});

// Vercel සඳහා මෙලෙස එක් කළ යුතුය
module.exports = app;
