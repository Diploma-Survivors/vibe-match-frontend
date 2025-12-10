'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function FooterCTA() {
  return (
    <section className="container mx-auto px-6 py-20 mb-10">
      <div className="relative group p-[2px] rounded-3xl overflow-hidden isolation-auto">
        {/* Infinite Animated Gradient Border */}
        <div
          className="absolute inset-[-100%]"
          style={{
            background:
              'conic-gradient(from 90deg at 50% 50%, #E2E8F0 0%, var(--primary) 50%, #E2E8F0 100%)',
            animation: 'spin 4s linear infinite',
          }}
        />

        {/* Main Card Content */}
        <motion.div
          className="relative bg-white dark:bg-slate-900 p-12 rounded-3xl text-center overflow-hidden h-full w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 -z-10" />

          <motion.h2
            className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white"
            initial={{ opacity: 0, y: '20px' }}
            whileInView={{ opacity: 1, y: '0px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Ready to Start?
          </motion.h2>

          <motion.p
            className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg"
            initial={{ opacity: 0, y: '20px' }}
            whileInView={{ opacity: 1, y: '0px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Join the community of developers mastering their craft daily.
          </motion.p>

          <Link href="/problems">
            <motion.div
              className="inline-block relative rounded-full p-[2px] overflow-hidden group/btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: '20px' }}
              whileInView={{ opacity: 1, y: '0px' }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,var(--primary)_50%,#E2E8F0_100%)] animate-spin-slow opacity-75 group-hover/btn:opacity-100" />
              <div className="relative bg-primary text-primary-foreground rounded-full px-10 py-4 text-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                Get Started Now
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
