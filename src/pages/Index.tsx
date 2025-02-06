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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
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
          Turn your <span className="font-instrument-serif italic font-normal">data</span> into
          <br />
          <span className="font-instrument-serif italic font-normal">insights</span>
          <span className="text-white/80">.</span>
        </motion.h1>
        
        <motion.div 
          variants={itemVariants}
          className="space-y-1 text-base md:text-lg text-white/60 leading-relaxed tracking-normal mb-10"
        >
          <p>Converse with your data, uncover insights:</p>
          <p>Our intuitive EDA platform automates</p>
          <p>exploratory analysis.</p>
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

      <div className="planet-glow" />
    </div>
  );
};

export default Index;