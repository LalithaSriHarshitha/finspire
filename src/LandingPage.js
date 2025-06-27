import React from "react";

const heroImage = {
  src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  alt: "Confident Indian businesswoman smiling"
};

const features = [
  {
    icon: "💼",
    title: "Smart Matching",
    description: "AI connects you with the perfect investors and mentors for your business stage and industry."
  },
  {
    icon: "🤝",
    title: "Community Support",
    description: "Join a network of ambitious women entrepreneurs who understand your journey and challenges."
  },
  {
    icon: "🚀",
    title: "Growth Resources",
    description: "Access curated workshops, guides, and tools to accelerate your business growth and leadership skills."
  }
];

const testimonials = [
  {
    name: "Aisha Patel",
    role: "Founder, BoldStart Ventures",
    quote: "The mentorship and resources here transformed my business approach completely.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Priya Sharma",
    role: "CEO, GreenTech Innovations",
    quote: "I found my co-founder and first customers through this amazing community.",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Neha Singh",
    role: "Founder & CEO, TechFlow Solutions",
    quote: "This platform connected me with the perfect angel investor. We secured $500K in funding!",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80"
  }
];

function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-pink-200 text-gray-900 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-pink-100 w-full">
        <div className="flex justify-between items-center px-4 py-3 w-full max-w-6xl mx-auto">
          <div className="flex items-center space-x-2">
            <span className="inline-block align-middle">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#F9A8D4" />
                <path d="M24 12L28 24H20L24 12Z" fill="white" />
                <circle cx="24" cy="32" r="4" fill="white" />
              </svg>
            </span>
            <h1 className="text-2xl font-bold text-pink-600 tracking-wide">FINSPIRE</h1>
          </div>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl text-sm font-medium shadow transition-all">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full py-10 sm:py-16 bg-pink-200 border-b border-pink-100">
        <div className="w-full max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 sm:gap-12 px-4 sm:px-6">
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Your Confidence. Your Business. <span className="text-pink-500">FINSPIRE</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              A landing page for women who are interested in doing business and are very confident. Join a new era of women-led success.
            </p>
            <button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl text-base sm:text-lg font-semibold shadow-lg transition-all">Start Your Journey</button>
          </div>
          <div className="flex-1 flex justify-center items-center w-full">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-white p-2 max-w-xs w-full">
              <img src={heroImage.src} alt={heroImage.alt} className="object-cover w-full h-64 sm:h-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-10 sm:py-14 bg-white border-b border-pink-100">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Choose FINSPIRE?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to turn your business dreams into reality.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-pink-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-10 sm:py-14 bg-pink-100">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real women who transformed their businesses
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover shadow mb-4 group-hover:scale-105 transition-transform"
                />
                <h3 className="text-base font-bold text-gray-900 mt-2">{testimonial.name}</h3>
                <p className="text-pink-500 font-medium text-xs mb-1">{testimonial.role}</p>
                <p className="text-gray-700 italic leading-relaxed text-base mb-2">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-200 text-gray-700 py-8 w-full border-t border-pink-300 mt-auto">
        <div className="w-full max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="inline-block align-middle">
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#F9A8D4" />
                <path d="M24 12L28 24H20L24 12Z" fill="white" />
                <circle cx="24" cy="32" r="4" fill="white" />
              </svg>
            </span>
            <span className="font-bold text-pink-600 text-lg">FINSPIRE</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex space-x-4 mb-1">
              <a href="mailto:contact@finspire.com" className="hover:text-pink-500 transition" title="Contact Us">
                <svg className="inline-block" width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75Zm1.5 0v.511l8.25 5.5 8.25-5.5V6.75a.75.75 0 0 0-.75-.75h-15a.75.75 0 0 0-.75.75Zm17.25 1.489-7.8 5.2a1.5 1.5 0 0 1-1.7 0l-7.8-5.2v9.011c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V8.239Z" fill="currentColor"/></svg>
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition" title="Twitter">
                <svg className="inline-block" width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.32 0-.63-.02-.94-.06A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7Z" fill="currentColor"/></svg>
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition" title="LinkedIn">
                <svg className="inline-block" width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" fill="currentColor"/></svg>
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition" title="Instagram">
                <svg className="inline-block" width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm6.25 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="currentColor"/></svg>
              </a>
            </div>
            <div className="text-xs text-gray-400">&copy; 2024 FINSPIRE. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

