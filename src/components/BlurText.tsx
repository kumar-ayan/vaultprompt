'use client';
import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  initialDelay?: number;
  className?: string;
  gradient?: boolean;
}

export default function BlurText({ text, delay = 0.05, initialDelay = 0, className = '', gradient = false }: BlurTextProps) {
  const elements = text.split(' ');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block' }}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={{ filter: 'blur(10px)', opacity: 0 }}
          animate={isInView ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(10px)', opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
            delay: initialDelay + index * delay,
          }}
          className={gradient ? "text-gradient" : ""}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {element}
        </motion.span>
      ))}
    </span>
  );
}
