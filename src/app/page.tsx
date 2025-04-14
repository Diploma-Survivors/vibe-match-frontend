"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { AnimatePresence, motion } from "framer-motion";
import { Layers, Move, RotateCcw, Settings, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export default function FramerMotionPlayground() {
  const [animation, setAnimation] = useState({
    duration: 0.6,
    stiffness: 100,
    damping: 10,
  });

  const [activeElements, setActiveElements] = useState({
    confetti: false,
    pulse: false,
    floating: false,
  });

  const [activeTab, setActiveTab] = useState("buttons");

  const toggleElement = (element: keyof typeof activeElements) => {
    setActiveElements((prev) => ({
      ...prev,
      [element]: !prev[element],
    }));
  };

  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-red-500",
  ];

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animation.duration,
        type: "spring",
        stiffness: animation.stiffness,
        damping: animation.damping,
      },
    },
  };

  const floatingVariants = {
    initial: {
      y: 0,
    },
    floating: {
      y: [-20, 0, -20],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    initial: {
      scale: 1,
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  const spinVariants = {
    initial: {
      rotate: 0,
    },
    spin: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  };

  const confettiVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 0.7,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
      },
    }),
    float: (i: number) => ({
      y: [0, -30, 0],
      x: [0, i % 2 === 0 ? 10 : -10, 0],
      transition: {
        duration: 3 + (i % 3),
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 text-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header with dynamic text */}
        <motion.div
          className="relative overflow-hidden h-32 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {activeElements.confetti && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={`confetti-${i}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`}
                  className={`absolute w-3 h-3 rounded-full ${
                    colors[i % colors.length]
                  }`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  custom={i}
                  variants={confettiVariants}
                  initial="hidden"
                  animate={["visible", "float"]}
                />
              ))}
            </div>
          )}

          <motion.h1
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-800"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: animation.stiffness,
              damping: animation.damping,
            }}
          >
            {"Motion Playground Pro".split("").map((char, i) => {
              // Use stable id based on character and position
              const charId = `char-${char}-${i}-${char.charCodeAt(0)}`;
              return (
                <motion.span
                  key={charId}
                  className="inline-block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: i * 0.05,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </motion.h1>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-white border-slate-200 shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Animation Controls */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Settings size={18} className="text-blue-600" />
                    Animation Settings
                  </h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label
                          htmlFor="duration-slider"
                          className="text-sm text-slate-700"
                        >
                          Duration: {animation.duration}s
                        </label>
                      </div>
                      <Slider
                        id="duration-slider"
                        value={[animation.duration]}
                        min={0.1}
                        max={2}
                        step={0.1}
                        onValueChange={(value) =>
                          setAnimation((prev) => ({
                            ...prev,
                            duration: value[0],
                          }))
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label
                          htmlFor="stiffness-slider"
                          className="text-sm text-slate-700"
                        >
                          Stiffness: {animation.stiffness}
                        </label>
                      </div>
                      <Slider
                        id="stiffness-slider"
                        value={[animation.stiffness]}
                        min={10}
                        max={200}
                        step={10}
                        onValueChange={(value) =>
                          setAnimation((prev) => ({
                            ...prev,
                            stiffness: value[0],
                          }))
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label
                          htmlFor="damping-slider"
                          className="text-sm text-slate-700"
                        >
                          Damping: {animation.damping}
                        </label>
                      </div>
                      <Slider
                        id="damping-slider"
                        value={[animation.damping]}
                        min={0}
                        max={30}
                        step={1}
                        onValueChange={(value) =>
                          setAnimation((prev) => ({
                            ...prev,
                            damping: value[0],
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Effects */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-600" />
                    Special Effects
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <Toggle
                      pressed={activeElements.confetti}
                      onPressedChange={() => toggleElement("confetti")}
                      className="data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                    >
                      Confetti
                    </Toggle>
                    <Toggle
                      pressed={activeElements.pulse}
                      onPressedChange={() => toggleElement("pulse")}
                      className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                    >
                      Pulse
                    </Toggle>
                    <Toggle
                      pressed={activeElements.floating}
                      onPressedChange={() => toggleElement("floating")}
                      className="data-[state=on]:bg-green-600 data-[state=on]:text-white"
                    >
                      Float
                    </Toggle>
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2 border-slate-300 hover:bg-slate-100"
                      onClick={() => {
                        // Reset all toggles
                        setActiveElements({
                          confetti: false,
                          pulse: false,
                          floating: false,
                        });
                      }}
                    >
                      <RotateCcw size={16} />
                      Reset Effects
                    </Button>
                  </div>
                </div>

                {/* Preset Animations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Zap size={18} className="text-yellow-500" />
                    Animation Presets
                  </h3>

                  <div className="grid grid-cols-1 gap-2">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="secondary"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white w-full"
                        onClick={() =>
                          setAnimation({
                            duration: 0.8,
                            stiffness: 120,
                            damping: 8,
                          })
                        }
                      >
                        Bouncy
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="secondary"
                        className="bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white w-full"
                        onClick={() =>
                          setAnimation({
                            duration: 0.4,
                            stiffness: 200,
                            damping: 20,
                          })
                        }
                      >
                        Snappy
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="secondary"
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90 text-white w-full"
                        onClick={() =>
                          setAnimation({
                            duration: 1.2,
                            stiffness: 40,
                            damping: 15,
                          })
                        }
                      >
                        Smooth
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for different element types */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Tabs
            defaultValue="buttons"
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger
                value="buttons"
                className="data-[state=active]:bg-blue-200"
              >
                Buttons
              </TabsTrigger>
              <TabsTrigger
                value="cards"
                className="data-[state=active]:bg-purple-200"
              >
                Cards
              </TabsTrigger>
              <TabsTrigger
                value="inputs"
                className="data-[state=active]:bg-green-600"
              >
                Inputs
              </TabsTrigger>
              <TabsTrigger
                value="shapes"
                className="data-[state=active]:bg-amber-600"
              >
                Shapes
              </TabsTrigger>
            </TabsList>

            {/* Buttons Tab */}
            <TabsContent value="buttons">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Button 1 */}
                <motion.div
                  className="flex flex-col items-center justify-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm"
                  variants={itemVariants}
                >
                  <motion.div
                    animate={activeElements.pulse ? "pulse" : "initial"}
                    variants={pulseVariants}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.15,
                        rotate: 3,
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: animation.stiffness,
                        damping: animation.damping,
                      }}
                    >
                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border-0">
                        Hover & Click Me
                      </Button>
                    </motion.div>
                  </motion.div>
                  <span className="text-sm text-slate-600">
                    Hover & Click Interaction
                  </span>
                </motion.div>

                {/* Button 2 */}
                <motion.div
                  className="flex flex-col items-center justify-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm"
                  variants={itemVariants}
                >
                  <motion.div
                    animate={activeElements.floating ? "floating" : "initial"}
                    variants={floatingVariants}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-green-600 text-white border-0">
                        Floating Button
                      </Button>
                    </motion.div>
                  </motion.div>
                  <span className="text-sm text-slate-600">
                    Floating Animation
                  </span>
                </motion.div>

                {/* Button 3 */}
                <motion.div
                  className="flex flex-col items-center justify-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm"
                  variants={itemVariants}
                >
                  <motion.div className="perspective">
                    <motion.div
                      whileHover={{
                        rotateY: 15,
                        rotateX: 10,
                        z: 10,
                        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: animation.stiffness,
                        damping: animation.damping,
                      }}
                    >
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg border-0">
                        3D Tilt Effect
                      </Button>
                    </motion.div>
                  </motion.div>
                  <span className="text-sm text-slate-600">
                    3D Transform on Hover
                  </span>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Cards Tab */}
            <TabsContent value="cards">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[1, 2, 3].map((item, idx) => (
                  <motion.div key={item} custom={idx} variants={itemVariants}>
                    <motion.div
                      animate={activeElements.floating ? "floating" : "initial"}
                      variants={floatingVariants}
                      custom={idx}
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          y: -10,
                          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: animation.stiffness,
                          damping: animation.damping,
                        }}
                      >
                        <Card className="overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer shadow-md">
                          <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                            <Layers
                              size={48}
                              className="text-white opacity-75"
                            />
                          </div>
                          <CardContent className="p-6">
                            <h3 className="font-bold text-xl mb-2">
                              Feature Card {item}
                            </h3>
                            <p className="text-slate-700">
                              This interactive card demonstrates motion design
                              principles with smooth transitions.
                            </p>
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-xs text-slate-500">
                                Last updated 2d ago
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 p-0"
                              >
                                Learn more
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Inputs Tab */}
            <TabsContent value="inputs">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Standard input with animation */}
                <motion.div
                  className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm"
                  variants={itemVariants}
                >
                  <motion.div
                    animate={activeElements.pulse ? "pulse" : "initial"}
                    variants={pulseVariants}
                  >
                    <label
                      htmlFor="standard-input"
                      className="text-sm text-slate-700 mb-2 block"
                    >
                      Standard Input
                    </label>
                    <motion.div
                      whileFocus={{
                        scale: 1.02,
                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: animation.stiffness,
                        damping: animation.damping,
                      }}
                    >
                      <Input
                        id="standard-input"
                        placeholder="Type something..."
                        className="bg-slate-50 border-slate-300 focus:border-blue-500 transition-all"
                      />
                    </motion.div>
                  </motion.div>
                  <p className="text-xs text-slate-600 mt-2">
                    Focus to see the animation effect
                  </p>
                </motion.div>

                {/* Search input with icon animation */}
                <motion.div
                  className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm"
                  variants={itemVariants}
                >
                  <label
                    htmlFor="search-input"
                    className="text-sm text-slate-700 mb-2 block"
                  >
                    Animated Search
                  </label>
                  <div className="relative">
                    <motion.span
                      className="absolute left-3 top-2.5 text-slate-500"
                      animate={activeElements.pulse ? "pulse" : "initial"}
                      variants={pulseVariants}
                      whileHover={{
                        rotate: 15,
                        scale: 1.2,
                        color: "#a855f7",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: animation.stiffness,
                        damping: animation.damping,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-labelledby="searchIconTitle"
                      >
                        <title id="searchIconTitle">Search Icon</title>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </motion.span>
                    <Input
                      id="search-input"
                      placeholder="Search..."
                      className="bg-slate-50 border-slate-300 pl-10 focus:border-purple-500 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    The search icon animates on hover
                  </p>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Shapes Tab */}
            <TabsContent value="shapes">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Circle */}
                <motion.div
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm"
                  variants={itemVariants}
                >
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg"
                    animate={activeElements.pulse ? "pulse" : "initial"}
                    variants={pulseVariants}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{
                      type: "spring",
                      stiffness: animation.stiffness,
                      damping: animation.damping,
                    }}
                  />
                  <span className="text-sm text-slate-600 mt-4">
                    Hover to transform
                  </span>
                </motion.div>

                {/* Square */}
                <motion.div
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm"
                  variants={itemVariants}
                >
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                    animate={activeElements.floating ? "floating" : "initial"}
                    variants={floatingVariants}
                    whileHover={{
                      rotate: 45,
                      borderRadius: "24px",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: animation.stiffness,
                      damping: animation.damping,
                    }}
                  />
                  <span className="text-sm text-slate-600 mt-4">
                    Hover to morph
                  </span>
                </motion.div>

                {/* Triangle (using SVG) */}
                <motion.div
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm"
                  variants={itemVariants}
                >
                  <motion.div
                    animate={activeElements.confetti ? "spin" : "initial"}
                    variants={spinVariants}
                    whileHover={{ scale: 1.2, y: -10 }}
                    transition={{
                      type: "spring",
                      stiffness: animation.stiffness,
                      damping: animation.damping,
                    }}
                  >
                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 100 100"
                      aria-labelledby="triangleShapeTitle"
                    >
                      <title id="triangleShapeTitle">Triangle Shape</title>
                      <motion.polygon
                        points="50,15 90,85 10,85"
                        fill="url(#triangleGradient)"
                        animate={{
                          fill: activeElements.pulse
                            ? ["#10b981", "#6366f1", "#10b981"]
                            : "#10b981",
                        }}
                        transition={{
                          duration: 2,
                          repeat: activeElements.pulse
                            ? Number.POSITIVE_INFINITY
                            : 0,
                          ease: "easeInOut",
                        }}
                      />
                      <defs>
                        <linearGradient
                          id="triangleGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                  <span className="text-sm text-slate-600 mt-4">
                    Hover to transform
                  </span>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Motion Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="bg-white border-slate-200 overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-slate-100 to-white py-3 px-6 border-b border-slate-200">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Move size={18} className="text-amber-600" />
                Interactive Preview
              </h3>
            </div>
            <CardContent className="p-0">
              <div className="bg-slate-50 min-h-60 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Background particles */}
                <AnimatePresence>
                  {activeElements.confetti && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={`particle-${i}-${Math.random()
                            .toString(36)
                            .substr(2, 9)}`}
                          className={`absolute w-2 h-2 rounded-full ${
                            colors[i % colors.length]
                          }`}
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          custom={i}
                          variants={confettiVariants}
                          initial="hidden"
                          animate={["visible", "float"]}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Draggable elements */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    {
                      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
                      icon: "🌊",
                    },
                    {
                      color: "bg-gradient-to-br from-purple-500 to-pink-500",
                      icon: "🔮",
                    },
                    {
                      color: "bg-gradient-to-br from-amber-500 to-red-500",
                      icon: "🔥",
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={`draggable-${item.icon}-${idx}`}
                      className="flex justify-center"
                      variants={itemVariants}
                      custom={idx}
                    >
                      <motion.div
                        className={`w-24 h-24 ${item.color} rounded-2xl shadow-xl flex items-center justify-center text-3xl cursor-move`}
                        drag
                        dragConstraints={{
                          left: 0,
                          right: 0,
                          top: 0,
                          bottom: 0,
                        }}
                        dragElastic={0.5}
                        dragTransition={{
                          bounceStiffness: animation.stiffness,
                          bounceDamping: animation.damping,
                        }}
                        whileDrag={{
                          scale: 1.1,
                          zIndex: 50,
                        }}
                        animate={
                          activeElements.floating ? "floating" : "initial"
                        }
                        variants={floatingVariants}
                        custom={idx}
                      >
                        {item.icon}
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add custom perspective CSS only */}
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
