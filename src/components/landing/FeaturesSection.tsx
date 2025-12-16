'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const features = [
  {
    key: 'algorithm-hub',
    icon: '⚡',
    title: 'Algorithm Hub',
    description:
      'Hundreds of curated problems. Filter by difficulty, tag, or company. Sharpen your logic.',
    color: 'text-primary',
  },
  {
    key: 'monaco-editor',
    icon: '💻',
    title: 'Monaco Editor',
    description:
      'Best-in-class coding experience. Syntax highlighting, auto-complete, and multiple themes.',
    color: 'text-chart-2',
  },
  {
    key: 'global-ranks',
    icon: '🏆',
    title: 'Global Ranks',
    description:
      'Compete in weekly contests. Climb the leaderboard and earn your digital badges.',
    color: 'text-chart-4',
  },
];

export function FeaturesSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: '50px' },
    visible: {
      opacity: 1,
      y: '0px',
      transition: { type: 'spring', stiffness: 50 },
    },
  };

  return (
    <section className="container mx-auto px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Why VibeMatch?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Designed for developers who demand excellence. Clean aesthetics,
            powerful tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.key}
              variants={itemVariants}
              className="relative p-8 rounded-2xl group cursor-default overflow-hidden"
              whileHover={{
                y: '-10px',
                transition: { type: 'spring', stiffness: 200 },
              }}
            >
              {/* Liquid Glass Background Layer */}
              <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-white/10 rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] transition-colors duration-300 group-hover:bg-white/20 dark:group-hover:bg-black/30" />

              {/* Refraction/Highlight effect */}
              <div className="absolute -inset-1/2 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 rotate-12 transition-all duration-700 blur-xl group-hover:animate-pulse" />

              <motion.div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl ${feature.color} bg-white/30 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-inner relative z-10`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 font-mono relative z-10 text-slate-700 dark:text-slate-200">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
