
import React, { useState } from 'react';
import { AIConsultant } from './components/AIConsultant';
import { IconZap, IconTarget, IconBarChart, IconBrain, IconMenu, IconX, IconQuote, IconCheck, IconAlertCircle, IconSync, IconFileText, IconShare, IconUserPlus, IconDatabase, IconHeadset } from './components/Icons';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Validation Logic
  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'company':
        if (!value.trim()) error = 'Company name is required';
        break;
      case 'message':
        if (!value.trim()) error = 'Please describe your objectives';
        else if (value.trim().length < 10) error = 'Please provide a bit more detail (min 10 chars)';
        break;
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('https://n8n.skuba.click/webhook/b6e8cd00-8b75-4710-8688-fb6e013bb997', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        console.error('Submission failed');
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-900 text-white selection:bg-nexus-accent selection:text-nexus-900 overflow-x-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-grid opacity-30"></div>
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-nexus-900 via-transparent to-nexus-900"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-30 glass-panel border-b-0 border-b-white/5 h-20 transition-all duration-300">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-nexus-800 border border-nexus-accent/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all overflow-hidden relative">
               <div className="absolute inset-0 bg-nexus-accent/10"></div>
               <span className="font-bold text-xl font-mono text-nexus-accent z-10">S</span>
            </div>
            <span className="font-bold text-xl tracking-wider font-mono">SKUBA<span className="text-nexus-accent">.AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            {['Services', 'Technology', 'Testimonials'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase().split(' ')[0])}
                className="hover:text-nexus-accent hover:text-glow transition-all relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nexus-accent transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-6 py-2 bg-nexus-500/10 border border-nexus-500/50 text-nexus-400 rounded-full hover:bg-nexus-500 hover:text-white hover:border-nexus-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300"
            >
              Start Growing
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             {mobileMenuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-nexus-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-slide-up">
            {['Services', 'Technology', 'Testimonials', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().split(' ')[0])}
                className="text-left py-3 text-gray-300 hover:text-nexus-accent border-b border-white/5 last:border-0"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden z-10">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-nexus-500/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-nexus-accent/10 rounded-full blur-[120px] -z-10 animate-float" />

        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-slide-up backdrop-blur-sm hover:border-nexus-accent/50 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-nexus-accent animate-pulse shadow-[0_0_10px_#00f0ff]"></span>
            <span className="text-xs md:text-sm font-mono text-nexus-accent">AI FOR EVERY BUSINESS</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight animate-slide-up animate-delay-100">
            Unleash Enterprise AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-accent to-nexus-500 text-glow">
              On Your Business
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up animate-delay-200">
            Small and medium businesses deserve the same firepower as the tech giants. Skuba AI automates your busywork, captures every lead, and boosts your profit margins—automatically.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-slide-up animate-delay-300">
            <button 
              onClick={() => scrollToSection('services')}
              className="px-8 py-4 bg-nexus-500 hover:bg-nexus-400 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/10"
            >
              See Solutions
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-transparent border border-white/20 hover:border-nexus-accent hover:text-nexus-accent text-white rounded-xl font-semibold backdrop-blur-sm transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            >
              Get a Free Audit
            </button>
          </div>

          {/* Stats Grid */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-t border-white/10 pt-12 animate-fade-in animate-delay-300">
             {[
               { label: 'SMBs Scaled', val: '250+' },
               { label: 'Hours Saved/Wk', val: '40+' },
               { label: 'Leads Captured', val: '24/7' },
               { label: 'Profit Increase', val: '35%' },
             ].map((stat, i) => (
               <div key={i} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                 <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-mono group-hover:text-nexus-accent transition-colors">{stat.val}</div>
                 <div className="text-sm text-gray-500 uppercase tracking-widest font-semibold">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">The Skuba Ecosystem</h2>
              <p className="text-gray-400 max-w-xl text-lg">We leverage advanced n8n automation to build invisible workflows that run your business while you sleep.</p>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-nexus-accent/50 to-transparent flex-1 ml-10 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              delay="0ms"
              icon={<IconSync className="w-8 h-8 text-nexus-accent" />}
              title="Cross-Platform Sync"
              desc="Real-time 2-way sync between your CRM, Slack, and Email. When a deal updates in one place, it updates everywhere."
            />
            <ServiceCard 
              delay="100ms"
              icon={<IconFileText className="w-8 h-8 text-nexus-400" />}
              title="Intelligent Invoicing"
              desc="Automatically extract data from PDF invoices in your inbox and push line items directly to Xero or QuickBooks."
            />
            <ServiceCard 
              delay="200ms"
              icon={<IconShare className="w-8 h-8 text-purple-400" />}
              title="Social Omni-Poster"
              desc="Write once, publish everywhere. Auto-format and schedule posts for LinkedIn, X, and Instagram from a single doc."
            />
            <ServiceCard 
              delay="300ms"
              icon={<IconUserPlus className="w-8 h-8 text-green-400" />}
              title="Smart Onboarding"
              desc="Trigger automated contract generation, folder creation, and welcome emails the second a deal is marked 'Closed'."
            />
            <ServiceCard 
              delay="400ms"
              icon={<IconDatabase className="w-8 h-8 text-orange-400" />}
              title="Lead Enrichment"
              desc="Instantly populate new leads with LinkedIn data, company size, and tech stack info before your sales team even calls."
            />
             <ServiceCard 
              delay="500ms"
              icon={<IconHeadset className="w-8 h-8 text-pink-400" />}
              title="Support Sentinel"
              desc="Analyze incoming tickets with AI to auto-tag urgency, draft empathetic responses, and route complex issues to human experts."
            />
          </div>
        </div>
      </section>

      {/* Technology / About */}
      <section id="technology" className="py-24 bg-nexus-900 border-y border-white/5 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-nexus-500/5"></div>
        <div className="container mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-r from-nexus-500 to-nexus-accent opacity-10 blur-[80px] rounded-full" />
              
              {/* Floating Hologram Effect */}
              <div className="relative glass-panel p-8 rounded-2xl border border-white/10 group hover:border-nexus-accent/50 transition-all duration-500">
                 <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <div className="font-mono text-xs text-nexus-accent flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-nexus-accent rounded-full animate-pulse"></span>
                       LIVE AGENT MONITOR
                    </div>
                    <div className="font-mono text-xs text-gray-500">ID: SK-992</div>
                 </div>
                 
                 <div className="space-y-4">
                    {[
                      { title: 'Inbound Lead', status: 'Qualifying...', color: 'text-yellow-400' },
                      { title: 'CRM Sync', status: 'Complete', color: 'text-green-400' },
                      { title: 'Email Outreach', status: 'Sending (142/500)', color: 'text-nexus-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-nexus-900/50 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${i===0 ? 'bg-yellow-400 animate-pulse' : i===1 ? 'bg-green-400' : 'bg-nexus-400'}`}></div>
                          <div className="font-semibold text-sm">{item.title}</div>
                        </div>
                        <div className={`text-xs font-mono ${item.color}`}>{item.status}</div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            
            <div className="animate-slide-up animate-delay-200">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Technology That <br/>Works For You</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Most AI is too complex for the average business. Skuba AI bridges the gap. We wrap sophisticated machine learning in simple, set-and-forget tools designed for ROI.
              </p>
              <ul className="space-y-4 mb-8">
                {['Zero-Learning Curve Dashboards', 'Seamless Integration with Your Tools', 'Enterprise-Grade Data Security', 'Dedicated AI Success Manager'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 group">
                    <div className="w-6 h-6 rounded bg-nexus-500/10 flex items-center justify-center border border-nexus-500/20 group-hover:border-nexus-accent/50 transition-colors">
                      <IconZap className="w-3 h-3 text-nexus-accent" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => scrollToSection('contact')} className="text-nexus-accent hover:text-white font-semibold flex items-center gap-2 group transition-colors">
                View integration list 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-nexus-900 relative overflow-hidden z-10">
        {/* Subtle Background Animation */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-nexus-accent/50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-nexus-500/5 rounded-full blur-[80px] -z-10 animate-pulse-slow"></div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Partner Success Stories</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              See how forward-thinking businesses are transforming their operations and scaling revenue with Skuba AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              delay="0ms"
              name="Sarah Jenkins"
              role="Founder, LogiTech Solutions"
              quote="Skuba AI transformed our manual data entry into a fully automated workflow. We saved 20+ hours a week instantly, allowing my team to focus on clients."
            />
            <TestimonialCard 
              delay="150ms"
              name="Michael Ross"
              role="Director, EstateFlow Real Estate"
              quote="The lead capture agent is incredible. It qualifies prospects while I sleep and books meetings directly to my calendar. Our conversion rate doubled in month one."
            />
            <TestimonialCard 
              delay="300ms"
              name="Jessica Tran"
              role="CMO, GrowthGear Marketing"
              quote="Finally, an AI agency that understands SMBs. The marketing automation engine has not only saved costs but actually improved our customer engagement metrics."
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden z-10">
        <div className="container mx-auto px-6 max-w-4xl">
           <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-nexus-500/30 transition-all duration-500">
             {/* Decorative grid */}
             <div className="absolute inset-0 opacity-[0.03]" 
                  style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
             </div>

             {submitStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in relative z-20">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <IconCheck className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Thank You</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Our team will contact you soon to discuss your custom AI roadmap.
                  </p>
                  <button 
                    onClick={() => setSubmitStatus('idle')}
                    className="mt-8 text-nexus-400 hover:text-white font-mono text-sm underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
             ) : (
               <>
                 <div className="relative z-10 text-center mb-10">
                   <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Transformation</h2>
                   <p className="text-gray-400">Ready to boost profits? Tell us about your business, and we'll design a custom AI roadmap for free.</p>
                 </div>

                 {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center animate-fade-in">
                       Submission failed. Please check your connection and try again.
                    </div>
                 )}

                 <form className="relative z-10 grid md:grid-cols-2 gap-6" onSubmit={handleSubmit} noValidate>
                   <div className="space-y-4">
                     <div className="relative">
                       <label htmlFor="name" className="block text-xs font-mono text-nexus-400 mb-1 uppercase tracking-wider">Your Identity</label>
                       <div className="relative">
                          <input 
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            type="text" 
                            placeholder="Full Name" 
                            className={`w-full bg-nexus-900/80 border rounded-lg p-3 text-white focus:outline-none transition-all ${errors.name ? 'border-red-500/50 focus:border-red-500 pr-10' : 'border-white/10 focus:border-nexus-accent focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]'}`} 
                          />
                          {errors.name && <IconAlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />}
                       </div>
                       {errors.name && <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.name}</p>}
                     </div>
                     
                     <div className="relative">
                       <label htmlFor="email" className="block text-xs font-mono text-nexus-400 mb-1 uppercase tracking-wider">Contact Point</label>
                       <div className="relative">
                         <input 
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            type="email" 
                            placeholder="Email Address" 
                            className={`w-full bg-nexus-900/80 border rounded-lg p-3 text-white focus:outline-none transition-all ${errors.email ? 'border-red-500/50 focus:border-red-500 pr-10' : 'border-white/10 focus:border-nexus-accent focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]'}`} 
                         />
                         {errors.email && <IconAlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />}
                       </div>
                       {errors.email && <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.email}</p>}
                     </div>
                     
                     <div className="relative">
                       <label htmlFor="company" className="block text-xs font-mono text-nexus-400 mb-1 uppercase tracking-wider">Organization</label>
                       <div className="relative">
                         <input 
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            type="text" 
                            placeholder="Company Name" 
                            className={`w-full bg-nexus-900/80 border rounded-lg p-3 text-white focus:outline-none transition-all ${errors.company ? 'border-red-500/50 focus:border-red-500 pr-10' : 'border-white/10 focus:border-nexus-accent focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]'}`} 
                         />
                         {errors.company && <IconAlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />}
                       </div>
                       {errors.company && <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.company}</p>}
                     </div>
                   </div>
                   
                   <div className="flex flex-col h-full relative">
                     <label htmlFor="message" className="block text-xs font-mono text-nexus-400 mb-1 uppercase tracking-wider">Mission Objectives</label>
                     <textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Tell us what takes up most of your time..." 
                        className={`w-full flex-1 bg-nexus-900/80 border rounded-lg p-3 text-white focus:outline-none transition-all resize-none h-32 md:h-auto ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-nexus-accent focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]'}`}
                     ></textarea>
                     {errors.message && <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.message}</p>}
                   </div>

                   <div className="md:col-span-2 mt-4">
                     <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-nexus-500 to-nexus-accent text-nexus-900 font-bold text-lg rounded-lg hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all transform hover:-translate-y-1 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                       {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-nexus-900 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-nexus-900 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-nexus-900 rounded-full animate-bounce delay-150"></span>
                          </div>
                       ) : (
                         <>
                           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                           <span className="relative">INITIATE GROWTH</span>
                         </>
                       )}
                     </button>
                   </div>
                 </form>
               </>
             )}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-nexus-950 border-t border-white/5 text-sm text-gray-500 relative z-10">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
               <div className="w-6 h-6 bg-nexus-800 border border-nexus-accent/30 rounded flex items-center justify-center font-bold text-xs text-nexus-accent">S</div>
               <span className="font-bold tracking-wider">SKUBA.AI</span>
            </div>
            <p className="mb-4">Democratizing AI for the builders and dreamers.</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li className="hover:text-nexus-accent cursor-pointer transition-colors">Workflow Automation</li>
              <li className="hover:text-nexus-accent cursor-pointer transition-colors">Lead Capture AI</li>
              <li className="hover:text-nexus-accent cursor-pointer transition-colors">Sales Enablement</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li className="hover:text-nexus-accent cursor-pointer transition-colors">Case Studies</li>
              <li className="hover:text-nexus-accent cursor-pointer transition-colors">About Skuba</li>
              <li className="hover:text-nexus-accent cursor-pointer transition-colors">Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Social</h4>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                <div key={social} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-nexus-accent hover:text-nexus-900 transition-all cursor-pointer hover:scale-110">
                  {social[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center font-mono text-xs text-gray-600">
          © 2024 SKUBA AI SOLUTIONS. POWERING THE FUTURE OF SMB.
        </div>
      </footer>

      <AIConsultant />
    </div>
  );
}

const ServiceCard = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: string }) => (
  <div 
    className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-nexus-accent/40 transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden animate-slide-up w-full h-full"
    style={{ animationDelay: delay }}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-nexus-accent/10 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150 group-hover:from-nexus-accent/20" />
    <div className="mb-6 p-4 bg-nexus-900/80 rounded-xl inline-block border border-white/10 group-hover:border-nexus-accent/50 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-nexus-accent transition-colors">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
      {desc}
    </p>
  </div>
);

const TestimonialCard = ({ name, role, quote, delay }: { name: string, role: string, quote: string, delay: string }) => (
  <div 
    className="group p-8 rounded-2xl bg-nexus-950 border border-white/5 hover:border-nexus-accent/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col items-center text-center animate-slide-up relative overflow-hidden"
    style={{ animationDelay: delay }}
  >
    <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>
    <div className="mb-6 p-3 bg-nexus-900 rounded-full border border-white/10 group-hover:border-nexus-accent/50 transition-colors relative z-10">
       <IconQuote className="w-6 h-6 text-nexus-400 group-hover:text-nexus-accent transition-colors" />
    </div>
    <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10">"{quote}"</p>
    <div className="mt-auto relative z-10">
       <h4 className="text-white font-bold text-lg group-hover:text-nexus-accent transition-colors">{name}</h4>
       <div className="text-nexus-400 text-xs uppercase tracking-widest font-mono mt-1">{role}</div>
    </div>
  </div>
);

export default App;
