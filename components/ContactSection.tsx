'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [charCount, setCharCount] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [visible, setVisible] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'message') setCharCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('http://localhost:5000/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success('✅ Message sent! We’ll get back to you soon.');
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setCharCount(0);
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      toast.error('❌ Failed to send message. Please try again later.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (formRef.current) observer.observe(formRef.current);

    return () => {
      if (formRef.current) observer.unobserve(formRef.current);
    };
  }, []);

  return (
  <section className="relative py-20">
  {/* 🔷 Video Background */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover z-0"
  >
    <source src="/vid/back_vid2.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* 🔷 Black Overlay */}
  <div className="absolute inset-0 bg-black/50 z-0"></div>

  {/* 🔷 Fade Top */}
  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-10"></div>

  {/* 🔷 Fade Bottom */}
  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>

  {/* 🔷 Content */}
  <div
    ref={formRef}
    className={`relative z-20 max-w-xl mx-auto bg-white/90 p-8 rounded-lg shadow-md transition-opacity duration-1000 transform ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`}
  >
    <h2 className="text-3xl font-bold text-center mb-4">Let’s Talk</h2>

    <p className="text-center text-muted-foreground mb-2">
      Have a question about our <strong>goods or services</strong>?
    </p>
    <p className="text-center text-muted-foreground mb-6">
      We’d love to help you with more information, prices, or custom options — send us a message today and we’ll get back to you shortly.
    </p>

    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Your Name"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Your Email"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
      />

      <div className="relative">
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          maxLength={500}
          placeholder="Your Message"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
          rows={4}
        />
        <div className="absolute bottom-1 right-2 text-xs text-gray-500">
          {charCount}/500
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
          status === 'success'
            ? 'bg-green-500 text-white'
            : status === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-primary text-black hover:bg-primary/90'
        }`}
      >
        {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === 'success' && <CheckCircle className="w-4 h-4" />}
        {status === 'error' && <XCircle className="w-4 h-4" />}
        {status === 'loading' && 'Sending...'}
        {status === 'success' && 'Sent!'}
        {status === 'error' && 'Failed'}
        {status === 'idle' && (
          <>
            <Send className="w-4 h-4" /> Send Message
          </>
        )}
      </button>
    </form>
  </div>
</section>
);
}
