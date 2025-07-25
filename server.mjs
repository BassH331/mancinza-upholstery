import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// ✅ Replace this with your real Resend API Key
const resend = new Resend(process.env.RESEND_API_KEY);

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

app.post('/booking', async (req, res) => {
  const { name, email, message } = req.body;

  console.log(`📨 Received booking data:`, { name, email, message });

  if (!name || !email || !message) {
    console.log('❌ Booking is missing required fields');
    return res.status(400).json({ message: 'All fields are required for booking.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'lbass1613@gmail.com',
      subject: `📅 New Booking from ${name}`,
      html: `
        <p><strong>Booking Details</strong></p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Details:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    if (error) {
      console.error('❌ Resend error (booking):', error);
      return res.status(500).json({ message: 'Failed to send booking email', error });
    }

    console.log('✅ Booking email sent!', data);
    return res.status(200).json({ message: 'Booking email sent successfully', data });
  } catch (err) {
    console.error('🔥 Unexpected server error (booking):', err);
    return res.status(500).json({ message: 'Unexpected booking server error', err });
  }
});


