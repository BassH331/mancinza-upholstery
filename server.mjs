import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const PORT = 5000;

// ✅ Replace this with your real Resend API Key
const resend = new Resend('re_GH9zk6LH_7gsTXQv5xUBPRU8f2PQmgK2t');

app.use(express.json());
app.use(cors());

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  console.log(`📨 Received form data:`, { name, email, message });

  if (!name || !email || !message) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    console.log('📡 Sending email with Resend...');
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Verified sender address
      to: 'lbass1613@gmail.com',    // <- Replace with your receiving email
      subject: `New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    if (error) {
      console.error('❌ Resend returned an error:', error);
      return res.status(500).json({ message: 'Failed to send email', error });
    }

    console.log('✅ Email sent!', data);
    return res.status(200).json({ message: 'Email sent', data });
  } catch (err) {
    console.error('🔥 Unexpected server error:', err);
    return res.status(500).json({ message: 'Unexpected server error', err });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('✅ Backend is running. Use POST /contact to send emails.');
});

