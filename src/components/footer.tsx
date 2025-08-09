"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-16">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-400">SolVibe</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Empowering creators with decentralized ownership, privacy, and
              fair rewards.
            </p>
          </div>

          {/* Platform Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/token"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  Token
                </Link>
              </li>
              <li>
                <Link
                  href="/nfts"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  NFTs
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/documentation"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/whitepaper"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link
                  href="/github"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Connect</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/twitter"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="/discord"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="/telegram"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  Telegram
                </Link>
              </li>
              <li>
                <Link
                  href="/medium"
                  className="text-slate-300 hover:text-white transition-colors text-sm"
                >
                  Medium
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8">
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              © 2025 SolVibe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
