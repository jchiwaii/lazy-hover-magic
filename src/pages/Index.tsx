import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import StarField from '../components/StarField';
import MouseGlow from '../components/MouseGlow';

const Index = () => {
  const centerGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (centerGlowRef.current) {
      gsap.to(centerGlowRef.current, {
        opacity: 1,
        duration: 2,
        ease: "power2.out"
      });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const text = "Coming soon...";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <StarField />
      <MouseGlow />
      
      <div ref={centerGlowRef} className="absolute inset-0 animate-center-glow" />
      
      <motion.div 
        className="relative z-10 text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight mb-8"
        >
          Turn your <span className="font-instrument-serif italic font-normal text-sky-400/80">data</span> into
          <br />
          <span className="font-instrument-serif italic font-normal text-sky-400/80">insights</span>
          <span className="text-white/80">.</span>
        </motion.h1>
        
        <motion.div 
          variants={itemVariants}
          className="space-y-1 text-base md:text-lg text-white/60 leading-relaxed tracking-normal mb-10"
        >
          <p>Chat with your data files and let us uncover insights</p>
          <p>We automate the exploratory data analysis</p>
          <p>For you.</p>
        </motion.div>
        
        <motion.div 
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="mt-8"
        >
          <motion.p className="font-instrument-serif text-[24px] italic text-white/70 tracking-wide">
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <a 
          href="https://www.linkedin.com/in/john-chiwai/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white/90 transition-colors duration-300 font-instrument-serif italic text-lg"
        >
          Collaboration?
        </a>
      </motion.div>

      <div className="planet-glow" />
    </div>
  );
};

export default Index;
