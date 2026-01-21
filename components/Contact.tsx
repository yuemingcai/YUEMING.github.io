
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Get In Touch</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Ready to start your journey?</h3>
        </div>

        <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
          <div className="bg-blue-700 p-12 md:w-1/3 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h4 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Information</h4>
              <p className="text-blue-100/80 mb-12 font-medium">Reach out to us anytime. We'll get back to you within 24 hours.</p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <i className="fa-solid fa-phone text-sm"></i>
                  </div>
                  <span className="font-semibold">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <i className="fa-solid fa-envelope text-sm"></i>
                  </div>
                  <span className="font-semibold">hello@cairuilin.com</span>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <i className="fa-solid fa-location-dot text-sm"></i>
                  </div>
                  <span className="font-semibold">Innovation City, KR</span>
                </div>
              </div>
            </div>

            {/* Social icons removed for a cleaner look */}
            <div className="mt-16 relative z-10">
              <p className="text-blue-200/50 text-xs font-bold uppercase tracking-widest">Cairuilin Studio Global</p>
            </div>
          </div>

          <div className="p-12 md:w-2/3 bg-slate-900">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-3xl mb-6 border border-green-500/20">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">Message Sent!</h4>
                <p className="text-slate-400 mb-8 max-w-xs mx-auto">Thank you for reaching out. Our team will contact you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition border border-slate-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Name</label>
                    <input 
                      type="text" 
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder:text-slate-600"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder:text-slate-600"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Message</label>
                  <textarea 
                    rows={5} 
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder:text-slate-600 resize-none"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-5 rounded-2xl font-black text-white transition-all shadow-xl uppercase tracking-tighter text-lg italic ${isSubmitting ? 'bg-slate-800 cursor-not-allowed text-slate-600' : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {isSubmitting ? 'Processing...' : 'Crack the project'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
