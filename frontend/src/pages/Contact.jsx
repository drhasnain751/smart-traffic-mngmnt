import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('INTEGRATION');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !message) return;
    setSending(true);
    
    // Simulate API delay
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 4000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
      
      {/* Intro */}
      <div className="space-y-6 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-mono font-bold tracking-wider text-brand-blue">
          OPERATIONAL SUPPORT
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight leading-none text-primary">
          Contact Control
        </h1>
        <p className="text-base text-primary-muted leading-relaxed">
          Reach our smart city coordination desk to report sensor hardware issues or coordinate API configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Left Form (7/12 width) */}
        <div className="md:col-span-7 bg-panel border border-border p-6 rounded-2xl shadow-premium h-fit">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center space-x-2 border-b border-border pb-3.5">
              <Mail className="h-4.5 w-4.5 text-brand-blue" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                Dispatch message
              </span>
            </div>

            {submitted && (
              <div className="bg-green-950/20 border border-green-500/20 p-3.5 rounded-lg flex items-center space-x-2.5 text-green-400 text-xs font-medium">
                <CheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span>Message successfully transmitted to transit desk.</span>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-semibold text-primary-muted font-mono">Operator Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="operator@city.gov"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue placeholder:text-zinc-600"
                required
              />
            </div>

            {/* Subject */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="contact-subject" className="text-xs font-semibold text-primary-muted font-mono">Subject Context</label>
              <select
                id="contact-subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue"
              >
                <option value="INTEGRATION">IoT Hardware Integration</option>
                <option value="BUG">System UI/Console Bug Report</option>
                <option value="EMERGENCY">Emergency Agency Coordination</option>
                <option value="ACCOUNT">Credentials & Workstation Help</option>
              </select>
            </div>

            {/* Message */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="contact-message" className="text-xs font-semibold text-primary-muted font-mono">Telemetry details</label>
              <textarea
                id="contact-message"
                placeholder="Detail sensor models, physical intersection location names, or specific API logs..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full h-28 focus:outline-none focus:border-brand-blue resize-none placeholder:text-zinc-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-primary hover:bg-primary-muted text-background text-xs font-bold py-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <Send className={`h-3.5 w-3.5 ${sending ? 'animate-spin' : ''}`} />
              <span>{sending ? 'Transmitting message...' : 'Transmit Operational Request'}</span>
            </button>
          </form>
        </div>

        {/* Right Info (5/12 width) */}
        <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="bg-panel border border-border p-6 rounded-2xl shadow-premium space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono border-b border-border pb-3">
              Transit Headquarters
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 text-primary-muted">
                <MapPin className="h-4.5 w-4.5 text-brand-blue flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-primary">Department of Mobility</span>
                  <span>420 Transit Way, Sector 4</span>
                  <span className="block">Manhattan, NY 10001</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-primary-muted">
                <Phone className="h-4.5 w-4.5 text-brand-blue" />
                <span>+1 (212) 555-8732 [Extension 4]</span>
              </div>

              <div className="flex items-center space-x-3 text-primary-muted">
                <Mail className="h-4.5 w-4.5 text-brand-blue" />
                <span>support@transit-os.gov</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 border border-border rounded-xl">
            <h4 className="text-[11px] font-mono font-bold text-brand-purple uppercase">Support SLA</h4>
            <p className="text-[10px] text-primary-muted leading-relaxed mt-1">
              Critical hardware incident reports are reviewed within 4 hours. Operator access requests require supervisor signature confirmation.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
