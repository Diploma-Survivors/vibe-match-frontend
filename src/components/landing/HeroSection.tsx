'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 50 },
    },
  };

  const floatingBadge = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={itemVariants}
              className="inline-block relative group"
            >
              <motion.div
                variants={floatingBadge}
                animate="animate"
                className="relative px-5 py-2.5 mb-6 rounded-full bg-slate-900/10 dark:bg-slate-100/5 backdrop-blur-md border border-white/20 dark:border-white/10 overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-sm tracking-wide">
                    <span className="text-slate-500 dark:text-slate-400">
                      {'// '}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">
                      It works on my machine
                    </span>
                    <span className="text-amber-500 ml-1">🤷‍♂️</span>
                  </span>
                  {/* Blinking Cursor */}
                  <motion.div
                    className="w-1.5 h-4 bg-primary/80"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      times: [0, 0.5, 0.5, 1],
                      ease: 'linear',
                    }}
                  />
                </div>

                {/* Gradient Border Overlay */}
                <div className="absolute inset-0 rounded-full border border-transparent [mask-image:linear-gradient(white,white)] pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              Master the Art of <br />
              <motion.span
                className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-1 inline-block"
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Algorithms
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed"
            >
              Nền tảng luyện tập lập trình chuẩn bootcamp.
              <span className="block mt-2 text-foreground/80 font-medium">
                Code &gt; Submit &gt; Rank Up.
              </span>
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link href="/problems">
                <motion.button
                  className="neu-btn text-lg font-medium px-8 py-4 flex items-center gap-2 group cursor-pointer"
                  whileHover={{ y: -4, filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Coding</span>
                  <motion.span
                    className="group-hover:translate-x-1 transition-transform inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      ease: 'easeInOut',
                      repeatDelay: 1,
                    }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>
              <Link href="/contests">
                <motion.button
                  className="neu-btn-outline text-lg font-medium px-8 py-4 cursor-pointer"
                  whileHover={{
                    y: -4,
                    backgroundColor: 'rgba(var(--primary), 0.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Contests
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual - Code Editor Mockup */}
          <motion.div
            className="flex-1 w-full max-w-lg lg:max-w-none perspective-1000"
            initial={{ opacity: 0, x: '50px', rotateY: '20deg' }}
            animate={{ opacity: 1, x: '0px', rotateY: '0deg' }}
            transition={{ type: 'spring', duration: 1.5, delay: 0.5 }}
          >
            <motion.div
              className="neu-flat p-6 bg-card rounded-2xl"
              whileHover={{
                rotateY: '-5deg',
                rotateX: '5deg',
                scale: 1.02,
                // Removed complex boxShadow to prevent motion crash
              }}
              style={{ transformStyle: 'preserve-3d' }}
              animate={{
                rotateZ: ['1deg', '-1deg', '1deg'],
                y: ['0px', '-10px', '0px'],
              }}
              transition={{
                rotateZ: {
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                },
                y: {
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                },
              }}
            >
              <div className="flex items-center gap-2 mb-4 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="font-mono text-sm space-y-2 text-muted-foreground select-none">
                <div className="flex">
                  <span className="text-primary mr-2">const</span>
                  <span className="text-chart-2">developer</span>
                  <span className="mx-2">=</span>
                  <span className="text-foreground">{'{'}</span>
                </div>
                <div className="pl-6">
                  <span className="text-chart-4">skill</span>:
                  <span className="text-chart-3 ml-2">'Problem Solving'</span>,
                </div>
                <div className="pl-6">
                  <span className="text-chart-4">level</span>:
                  <span className="text-chart-1 ml-2">'Expert'</span>,
                </div>
                <div className="pl-6">
                  <span className="text-chart-4">platform</span>:
                  <span className="text-primary ml-2">'VibeMatch'</span>
                </div>
                <div className="text-foreground">{'};'}</div>
                <div className="h-4" />
                <div className="flex">
                  <span className="text-primary mr-2">await</span>
                  <span className="text-foreground">developer.</span>
                  <span className="text-chart-2">levelUp</span>
                  <span className="text-foreground">()</span>
                  {';'}
                  <motion.div
                    className="w-2 h-5 bg-primary ml-1 inline-block"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
