import React from 'react';

const Stack: React.FC = () => {
  const stack = [
    { name: 'JavaScript', icon: 'devicon-javascript-plain' },
    { name: 'Node.js', icon: 'devicon-nodejs-plain' },
    { name: 'CSS', icon: 'devicon-css3-plain' },
    { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original' },
  ];

  return (
    <section id="stack" className="py-16 md:py-24 px-4 md:px-6 bg-white scroll-mt-24 border-b-thick border-black">
      <div className="container mx-auto max-w-[65ch] md:max-w-5xl">
        <div className="mb-12 md:mb-16 text-center md:text-left">
          <h2 className="text-4xl font-archivo mb-4 uppercase">Technology Stack</h2>
          <p className="text-black/60 max-w-[65ch] mx-auto md:mx-0 text-xs md:text-sm font-archivo uppercase tracking-widest leading-relaxed">Core technologies utilized for daily development.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 bg-black border-thick border-black gap-[3px]">
          {stack.map((item) => (
            <div 
              key={item.name}
              className="bg-white p-8 md:p-12 flex flex-col items-center justify-center group hover:bg-black transition-all cursor-pointer"
              tabIndex={0}
              aria-label={`Technology: ${item.name}`}
            >
              <i className={`${item.icon} text-4xl md:text-5xl mb-4 md:mb-6 grayscale opacity-60 group-hover:invert group-hover:opacity-100 transition-all`} aria-hidden="true"></i>
              <span className="text-[10px] font-archivo uppercase tracking-[0.2em] text-black group-hover:text-white transition-colors text-center">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;