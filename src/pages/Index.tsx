import React from 'react';
import StarField from '../components/StarField';
import MouseGlow from '../components/MouseGlow';

const Index = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <StarField />
      <MouseGlow />
      
      <div className="relative z-10 text-center px-4">
        <h1 className="opacity-0 animate-fade-up [animation-delay:300ms] text-4xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight">
          Turn your <span className="font-normal italic">data</span> into
          <br />
          <span className="font-normal italic">insights</span><span className="text-white/80">.</span>
        </h1>
        
        <div className="opacity-0 animate-fade-up [animation-delay:600ms] space-y-4 text-lg md:text-xl text-white/60">
          <p>Converse with your data, uncover insights:</p>
          <p>Our intuitive EDA platform automates</p>
          <p>exploratory analysis.</p>
        </div>
        
        <div className="opacity-0 animate-fade-up [animation-delay:900ms] mt-12">
          <p className="text-2xl md:text-3xl font-light italic text-white/80">Coming soon...</p>
        </div>
      </div>

      <div className="planet-glow" />
    </div>
  );
};

export default Index;