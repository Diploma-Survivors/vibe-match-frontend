"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import clientApi from "@/lib/apis/axios-client";
import { toastService } from "@/services/toasts-service";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { HiMail, HiLockClosed, HiUser } from "react-icons/hi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const finalUsername = (formData.get("username") as string) || username;
    const finalPassword = (formData.get("password") as string) || password;

    if (isSignUp) {
      if (password !== confirmPassword) {
        toastService.error("Passwords do not match");
        setLoading(false);
        return;
      }

      try {
        await clientApi.post("/auth/register", {
          email,
          username,
          password,
          fullName,
        });
        toastService.success("Registration successful! Logging in...");

        const result = await signIn("credentials", {
          username: finalUsername,
          password: finalPassword,
          redirect: true,
          callbackUrl,
        });

        if (result?.error) {
          toastService.error(result.error);
        }
      } catch (error: any) {
        toastService.error(
          error.response?.data?.message || "Registration failed"
        );
      }
    } else {
      const result = await signIn("credentials", {
        username: finalUsername,
        password: finalPassword,
        redirect: false,
      });

      if (result?.error) {
        toastService.error(result.error);
      } else {
        window.location.href = callbackUrl;
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black font-sans">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.85 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/login-texture.png"
            alt="Cinematic Background"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Netflix-style Overlays (Heavy Vignetting & Darkening) */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
      </div>

      {/* Subtle Energy Pulsing (Overlay) */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-10 pointer-events-none bg-emerald-500/5 mix-blend-overlay"
      />

      {/* Logo - Top Left */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-10 left-10 z-30"
      >
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/40 transform group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-black text-2xl italic">S</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-md">
            sFinx
          </h1>
        </div>
      </motion.div>

      {/* Center Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative z-20 w-full max-w-lg p-6"
      >
        <Card className="border-none shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-zinc-950/85 backdrop-blur-3xl ring-1 ring-white/5 rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-8 pt-12">
            <CardTitle className="text-5xl font-black tracking-tight text-white mb-2">
              {isSignUp ? "Join the Hub" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-zinc-400 text-lg font-medium">
              {isSignUp
                ? "Create your account to start competing"
                : "Access the world of competitive programming"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? "signup" : "login"}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-5"
                >
                  {isSignUp && (
                    <motion.div variants={itemVariants} className="space-y-5">
                      <div className="relative group">
                        <HiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors w-6 h-6" />
                        <Input
                          id="email"
                          name="email"
                          placeholder="Email address"
                          type="email"
                          className="pl-14 h-16 bg-zinc-900/50 border-zinc-800 text-white text-lg placeholder:text-zinc-600 focus:border-green-500/50 focus:ring-green-500/10 transition-all rounded-2xl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="relative group">
                        <HiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors w-6 h-6" />
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Full name"
                          type="text"
                          className="pl-14 h-16 bg-zinc-900/50 border-zinc-800 text-white text-lg placeholder:text-zinc-600 focus:border-green-500/50 focus:ring-green-500/10 transition-all rounded-2xl"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    variants={itemVariants}
                    className="relative group"
                  >
                    <HiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors w-6 h-6" />
                    <Input
                      id="username"
                      name="username"
                      placeholder="Username"
                      type="text"
                      className="pl-14 h-16 bg-zinc-900/50 border-zinc-800 text-white text-lg placeholder:text-zinc-600 focus:border-green-500/50 focus:ring-green-500/10 transition-all rounded-2xl"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="relative group"
                  >
                    <HiLockClosed className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors w-6 h-6" />
                    <Input
                      id="password"
                      name="password"
                      placeholder="Password"
                      type="password"
                      className="pl-14 h-16 bg-zinc-900/50 border-zinc-800 text-white text-lg placeholder:text-zinc-600 focus:border-green-500/50 focus:ring-green-500/10 transition-all rounded-2xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </motion.div>

                  {isSignUp && (
                    <motion.div
                      variants={itemVariants}
                      className="relative group"
                    >
                      <HiLockClosed className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors w-6 h-6" />
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        type="password"
                        className="pl-14 h-16 bg-zinc-900/50 border-zinc-800 text-white text-lg placeholder:text-zinc-600 focus:border-green-500/50 focus:ring-green-500/10 transition-all rounded-2xl"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {!isSignUp && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-semibold text-zinc-500 hover:text-green-500 transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <Button
                  className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-xl rounded-2xl transition-all duration-300 shadow-2xl shadow-green-500/20 border-none"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Authenticating...
                    </div>
                  ) : isSignUp ? (
                    "Get Started"
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">
                <span className="bg-zinc-950 px-6">OR USE THIRD PARTY</span>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-16 bg-white/5 border-zinc-800 hover:border-zinc-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 group"
                type="button"
              >
                <FcGoogle className="mr-3 h-7 w-7 group-hover:scale-110 transition-transform" />
                Sign in with Google
              </Button>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-12 text-center text-lg">
            <div className="text-zinc-500 font-medium">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="text-white font-black hover:text-green-500 transition-colors decoration-green-500/50 hover:underline underline-offset-8"
              >
                {isSignUp ? "Log In" : "Sign Up Now"}
              </button>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-xs uppercase tracking-widest font-black opacity-40">
            Enterprise Grade Security &bull; sFinx Platform &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
