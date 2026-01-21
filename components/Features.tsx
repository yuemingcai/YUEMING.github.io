
import React from 'react';

const services = [
  {
    icon: 'fa-palette',
    title: 'Brand Identity',
    description: 'We create unique and memorable brand identities that resonate with your target audience and stand out in the market.'
  },
  {
    icon: 'fa-code',
    title: 'Web Development',
    description: 'Custom, high-performance websites built with the latest technologies to ensure speed, security, and scalability.'
  },
  {
    icon: 'fa-mobile-screen',
    title: 'Mobile Solutions',
    description: 'Responsive and native mobile experiences that provide seamless interaction across all devices and screen sizes.'
  },
  {
    icon: 'fa-chart-line',
    title: 'Digital Marketing',
    description: 'Strategic marketing campaigns designed to increase visibility, drive engagement, and maximize your return on investment.'
  },
  {
    icon: 'fa-camera',
    title: 'Content Creation',
    description: 'Engaging photography, video, and copy that tells your brand story and connects with your customers emotionally.'
  },
  {
    icon: 'fa-headset',
    title: 'Ongoing Support',
    description: 'Reliable maintenance and support services to keep your digital assets running smoothly and up to date.'
  }
];

const Features: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">What We Do</h2>
        <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-16">Modern Solutions for Digital Success</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, idx) => (
            <div key={idx} className="p-8 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-xl transition duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <i className={`fa-solid ${service.icon}`}></i>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h4>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
