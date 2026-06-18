'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallMeInstantlyCard from "@/components/CallMeInstantlyCard";
import EnquiryIcon, { PhoneIcon } from "@/components/EnquiryIcon";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, CONTACT_OFFICE, CONTACT_BUILDING, CONTACT_CITY, CONTACT_MAPS_URL } from "@/lib/contact";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          subject: formData.subject,
          message: formData.message,
          notes: `Contact form: ${formData.subject}`,
          items: [],
          total: 0,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send');

      setFeedback({
        type: 'success',
        text: data.message || 'Thank you! Your message has been sent. We will get back to you soon.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setFeedback({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-navy-blue via-[#1e4a7a] to-brand-teal text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Contact Us</h1>
          <p className="text-lg text-white/80">
            Get in touch with our team — we&apos;re here to help you seal the deal.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left — Call + Form */}
            <div className="space-y-6">
              <CallMeInstantlyCard />

              <div className="bg-gradient-to-br from-navy-blue to-[#1e4a7a] p-8 rounded-2xl shadow-soft border border-white/10 text-white">
                <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

                {feedback && (
                  <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium border ${
                    feedback.type === 'success' ? 'bg-green-500/20 text-green-100 border-green-400/30' : 'bg-red-500/20 text-red-100 border-red-400/30'
                  }`}>
                    {feedback.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1.5">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal"
                      placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1.5">Email</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                        placeholder="john@example.com" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-1.5">Phone</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                        placeholder={CONTACT_PHONE_DISPLAY} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white/90 mb-1.5">Subject</label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50 [&>option]:text-gray-900">
                      <option value="">Select a subject</option>
                      <option value="Buying a Property">Buying a Property</option>
                      <option value="Selling a Property">Selling a Property</option>
                      <option value="Renting a Property">Renting a Property</option>
                      <option value="Investment Consultation">Investment Consultation</option>
                      <option value="Other Inquiry">Other Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-1.5">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                      placeholder="Tell us how we can help you..." />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-accent-orange text-white px-8 py-3.5 rounded-xl font-bold hover:bg-accent-orange/90 transition disabled:opacity-70">
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right — Contact info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-navy-blue to-[#1e4a7a] p-8 rounded-2xl shadow-soft border border-white/10 text-white">
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  {[
                    {
                      variant: 'teal' as const,
                      title: 'Address',
                      content: (
                        <a
                          href={CONTACT_MAPS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/85 hover:text-accent-orange transition leading-relaxed"
                        >
                          {CONTACT_OFFICE}<br />
                          {CONTACT_BUILDING}<br />
                          {CONTACT_CITY}
                        </a>
                      ),
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                    },
                    {
                      variant: 'red' as const,
                      title: 'Phone',
                      content: (
                        <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-white/85 hover:text-accent-orange transition">
                          {CONTACT_PHONE_DISPLAY}
                        </a>
                      ),
                      icon: <PhoneIcon className="w-4 h-4" />,
                    },
                    {
                      variant: 'navy' as const,
                      title: 'Email',
                      content: <span className="text-white/85">info@fdmakan.com<br />support@fdmakan.com</span>,
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <EnquiryIcon variant={item.variant}>{item.icon}</EnquiryIcon>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                        <div className="text-sm leading-relaxed">{item.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-navy-blue to-brand-teal text-white p-8 rounded-2xl shadow-soft border border-white/10">
                <h3 className="text-xl font-bold mb-4 text-white">Business Hours</h3>
                <div className="space-y-2 text-sm text-white/90">
                  <div className="flex justify-between"><span>Monday – Friday</span><span>9:00 AM – 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span>10:00 AM – 4:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
