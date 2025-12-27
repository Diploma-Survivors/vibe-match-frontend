'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import clientApi from '@/lib/apis/axios-client';
import { toastService } from '@/services/toasts-service';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const finalUsername = (formData.get('username') as string) || username;
    const finalPassword = (formData.get('password') as string) || password;

    if (isSignUp) {
      if (password !== confirmPassword) {
        toastService.error('Passwords do not match');
        return;
      }

      try {
        await clientApi.post('/auth/register', {
          email,
          username,
          password,
          fullName,
        });
        toastService.success('Registration successful! Logging in...');

        // Auto login after successful registration
        const result = await signIn('credentials', {
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
          error.response?.data?.message || 'Registration failed'
        );
      }
    } else {
      const result = await signIn('credentials', {
        username: finalUsername,
        password: finalPassword,
        redirect: true,
        callbackUrl,
      });

      if (result?.error) {
        toastService.error(result.error);
      } else {
        window.location.href = callbackUrl;
      }
    }
  };

  const handleGoogleLogin = async () => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/google';
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-green-600">
            Welcome to sFinx
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Create an account to get started'
              : 'Enter your login information to access your account'}
          </CardDescription>
        </CardHeader>

        {/* 3. Wrap inputs in a <form> tag */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Full Name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Input
                id="username"
                name="username" // 4. Add 'name' attribute for autofill
                placeholder="Username"
                type="text"
                autoCapitalize="none"
                autoComplete="username" // 5. Help browser identify field
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password" // 4. Add 'name' attribute
                placeholder="Password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'} // 5. Help browser
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {/* 6. Change type to "submit" to allow Enter key submission */}
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              type="submit"
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </Button>
          </form>

          <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or login with
              </span>
            </div>
          </div>

          <Button
            onClick={() => handleGoogleLogin()}
            variant="outline"
            className="w-full mt-4"
            type="button"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <div>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span
              onClick={toggleMode}
              className="underline underline-offset-4 hover:text-primary cursor-pointer font-medium"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
