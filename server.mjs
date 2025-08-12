// server.ts / index.ts
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173', // or 3000
    'https://mancinza-upholstery.onrender.com',
    'https://<your-frontend-domain>'
  ]
}));

// ⬇️ allow big base64 PoP payloads
app.use(express.json({ limit: '15mb' }));

const resend = new Resend(process.env.RESEND_API_KEY);

// health
app.get('/', (_req, res) => res.send('✅ Backend alive.'));

app.post('/booking', async (req, res) => {
  const { name, email, message, proofOfPayment } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing name/email/message.' });
  }

  // parse data URL to get mime + base64
  let attachments = [];
  if (typeof proofOfPayment === 'string' && proofOfPayment.startsWith('data:')) {
    const m = proofOfPayment.match(/^data:(.+);base64,(.*)$/);
    if (m) {
      const mime = m[1];
      const b64 = m[2];
      const filename = mime.includes('pdf') ? 'proof-of-payment.pdf' : 'proof-of-payment.png';

      // Resend supports attachments as Buffers
      attachments = [{ filename, content: Buffer.from(b64, 'base64') }];
    }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'mancinza@enquiry.dev',              // use your verified sender
      to: 'mancinza44@gmail.com',                  // your inbox
      subject: `✅ Order Approved — ${name}`,
      html: `
        <h2>Order Approved</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Details:</strong></p>
        <pre style="white-space:pre-wrap">${message}</pre>
        <p>${attachments.length ? 'PoP attached.' : 'No PoP attached.'}</p>
      `,
      attachments, // ← attaches PoP if provided
    });

    if (error) return res.status(500).json({ message: 'Failed to send booking email', error });
    return res.status(200).json({ message: 'Booking email sent', data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unexpected server error' });
  }
});

app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
