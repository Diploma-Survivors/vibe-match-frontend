"use client";

import { ParticleBackground } from "@/components/particle-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Award,
  ChevronDown,
  Database,
  DollarSign,
  Lock,
  Shield,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

export default function HomePage() {
  const [walletConnected, setWalletConnected] = useState(false);

  // Intersection observer hooks for animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [problemsRef, problemsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [solanaRef, solanaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [audienceRef, audienceInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const connectWallet = () => {
    // This would be replaced with actual Solana wallet connection logic
    setWalletConnected(!walletConnected);
    console.log("Connecting to Solana wallet...");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Full-page background */}
      <ParticleBackground />

      {/* Hero Section */}
      <div className="relative w-full h-screen" id="hero">
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                ref={heroRef}
                initial={{ opacity: 0, x: -50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-xl"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    SolVibe
                  </span>
                </h1>
                <p className="text-xl text-black/90 mb-6">
                  Empowering creators with decentralized ownership, privacy, and
                  fair rewards.
                </p>
                <p className="text-lg text-black/80 mb-8">
                  A decentralized social media platform built on Solana
                  blockchain, leveraging high transaction speeds and low costs
                  to create a transparent, user-owned ecosystem.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-black text-white hover:bg-black/90 px-8 py-6">
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    className="text-black border-black hover:bg-black/10 px-8 py-6"
                    onClick={() => {
                      window.location.href = "/problems";
                    }}
                  >
                    Browse Problems
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden md:block"
              >
                {/* This div is intentionally left empty as the particle background covers this area */}
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection("problems")}
        >
          <ChevronDown className="animate-bounce" size={32} />
        </motion.div>
      </div>

      {/* Problems Section */}
      <section id="problems" className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            ref={problemsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={problemsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Problems We Solve</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Centralized social media platforms face significant challenges
              that SolVibe addresses through blockchain technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Lock className="h-12 w-12 text-green-600" />,
                title: "Content Censorship",
                description:
                  "Content removed or restricted by central authorities.",
              },
              {
                icon: <Shield className="h-12 w-12 text-green-600" />,
                title: "Data Privacy",
                description:
                  "User data stored centrally, vulnerable to exploitation.",
              },
              {
                icon: <DollarSign className="h-12 w-12 text-green-600" />,
                title: "Unfair Profit Distribution",
                description:
                  "Creators receive little to no deserved compensation.",
              },
              {
                icon: <Award className="h-12 w-12 text-green-600" />,
                title: "Copyright Violations",
                description:
                  "Content easily misused without clear ownership proof.",
              },
            ].map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 30 }}
                animate={problemsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{problem.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Solana Section */}
      <section id="why-solana" className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            ref={solanaRef}
            initial={{ opacity: 0, y: 30 }}
            animate={solanaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Solana?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Solana is the ideal blockchain platform for SolVibe due to its
              unique advantages.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={solanaInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-green-600 to-emerald-600 p-1 rounded-2xl"
            >
              <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl h-full">
                <div className="grid grid-cols-1 gap-6">
                  {[
                    {
                      icon: <Zap className="h-8 w-8 text-green-600" />,
                      title: "High Transaction Speed",
                      description:
                        "Thousands of transactions per second (TPS), ideal for social media interactions.",
                    },
                    {
                      icon: <DollarSign className="h-8 w-8 text-green-600" />,
                      title: "Low Cost",
                      description:
                        "Average transaction fee of ~$0.00025, perfect for NFT minting and microtransactions.",
                    },
                    {
                      icon: <Database className="h-8 w-8 text-green-600" />,
                      title: "Strong Ecosystem",
                      description:
                        "Tools like Anchor, Metaplex, and Solana Wallet Adapter support efficient development.",
                    },
                    {
                      icon: <Users className="h-8 w-8 text-green-600" />,
                      title: "Scalability",
                      description:
                        "Accommodates user growth without performance impact.",
                    },
                  ].map((feature, index) => (
                    <div key={feature.title} className="flex items-start">
                      <div className="mr-4">{feature.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={solanaInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl"
            >
              <h3 className="text-3xl font-bold mb-6">Solana Powers SolVibe</h3>
              <p className="text-lg text-gray-600 mb-6">
                SolVibe leverages Solana's high-performance blockchain to create
                a truly decentralized social media experience that prioritizes
                creator ownership and fair rewards.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                With Solana's infrastructure, we can offer seamless
                interactions, affordable NFT minting, and a responsive platform
                that scales with our community.
              </p>
              <div className="relative h-12 w-full max-w-md bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={solanaInView ? { width: "95%" } : {}}
                  transition={{ duration: 1.5, delay: 0.6 }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                  95% Lower Fees Than Ethereum
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SolVibe brings a decentralized social media platform with
              innovative blockchain features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Decentralized Storage",
                description:
                  "Content stored on Arweave with metadata and hash on Solana for authenticity verification.",
                delay: 0.1,
              },
              {
                title: "Content NFT",
                description:
                  "Each content piece linked to a unique NFT, proving ownership and enabling automatic royalties.",
                delay: 0.2,
              },
              {
                title: "SolVibe Token (SOLV)",
                description:
                  "Rewards for users creating content, engaging, and participating in curation.",
                delay: 0.3,
              },
              {
                title: "NFT Badges",
                description:
                  "Special NFTs for outstanding creators, providing benefits like increased visibility or exclusive feature access.",
                delay: 0.4,
              },
              {
                title: "Community Curation",
                description:
                  "On-chain voting with quadratic voting and user reputation to rank quality content.",
                delay: 0.5,
              },
              {
                title: "Decentralized Identity",
                description:
                  "Users manage profiles via Solana wallets, fully owning their data.",
                delay: 0.6,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: feature.delay }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-green-600"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold mb-6">How It Works</h3>
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Connect Wallet",
                  description:
                    "Register using your Solana wallet (like Phantom).",
                },
                {
                  step: "02",
                  title: "Create Content",
                  description:
                    "Post content that's stored on Arweave with an on-chain NFT.",
                },
                {
                  step: "03",
                  title: "Engage & Earn",
                  description: "Like, comment, share, and earn SOLV tokens.",
                },
                {
                  step: "04",
                  title: "Community Curation",
                  description:
                    "Vote on content to increase visibility based on user reputation.",
                },
              ].map((step, index) => (
                <div
                  key={step.step}
                  className="flex flex-col items-center max-w-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-4">
                    {step.step}
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                  {index < 3 && (
                    <div className="hidden md:block h-0.5 w-12 bg-green-600 absolute translate-x-[150px] mt-6" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="audience" className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            ref={audienceRef}
            initial={{ opacity: 0, y: 30 }}
            animate={audienceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Who Is SolVibe For?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SolVibe caters to various groups seeking a better social media
              experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Content Creators",
                description:
                  "Those seeking fair compensation, copyright protection, and recognition.",
                delay: 0.1,
              },
              {
                title: "Privacy-Focused Users",
                description:
                  "Individuals who prioritize control over their personal data.",
                delay: 0.2,
              },
              {
                title: "Web3 Enthusiasts",
                description:
                  "Supporters of decentralized applications and blockchain technology.",
                delay: 0.3,
              },
              {
                title: "Communities",
                description:
                  "Groups looking to build social spaces free from centralized control.",
                delay: 0.4,
              },
              {
                title: "Businesses",
                description:
                  "Organizations needing blockchain solutions for content rights management.",
                delay: 0.5,
              },
            ].map((audience, index) => (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 30 }}
                animate={audienceInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: audience.delay }}
                className="bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm p-8 rounded-xl hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 text-green-700">
                  {audience.title}
                </h3>
                <p className="text-gray-700">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
