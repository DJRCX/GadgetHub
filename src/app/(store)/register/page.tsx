"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { userRepository } from "@/lib/services/repositories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const loginCustomer = useAuthStore((state) => state.loginCustomer);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const allUsers = await userRepository.getAll();
      const exists = allUsers.some((user) => user.email.toLowerCase() === normalizedEmail && user.role === "customer");

      if (exists) {
        setError("An account with this email already exists. Please sign in.");
        setLoading(false);
        return;
      }

      const finalName = name.trim() || normalizedEmail.split("@")[0];
      await userRepository.create({
        id: `user-${Date.now()}`,
        name: finalName,
        email: normalizedEmail,
        phone: phone.trim(),
        role: "customer",
      });

      loginCustomer({ name: finalName, email: normalizedEmail });
      router.push("/");
    } catch (submissionError) {
      console.error(submissionError);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 bg-muted/20">
      <Card className="w-full max-w-md border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-black tracking-tight">Create Account</CardTitle>
          <CardDescription>Register to track orders and speed up checkout.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+8801XXXXXXXXX" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-3">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Already registered?{" "}
                <Link href="/signin" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
