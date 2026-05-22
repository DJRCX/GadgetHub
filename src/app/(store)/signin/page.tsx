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

export default function CustomerSignInPage() {
  const router = useRouter();
  const loginCustomer = useAuthStore((state) => state.loginCustomer);
  const customerName = useAuthStore((state) => state.customerName);
  const [name, setName] = useState(customerName || "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const allUsers = await userRepository.getAll();
      const existingUser = allUsers.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.role === "customer");

      if (!existingUser) {
        setError("No customer account found with this email. Please register first.");
        setLoading(false);
        return;
      }

      const finalName = name.trim() || existingUser.name || email.split("@")[0];
      loginCustomer({ name: finalName, email: email.trim().toLowerCase() });
      router.push("/");
    } catch (submissionError) {
      console.error(submissionError);
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 bg-muted/20">
      <Card className="w-full max-w-md border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-black tracking-tight">Customer Sign In</CardTitle>
          <CardDescription>Use your email to continue shopping and checkout faster.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
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
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-3">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                New here?{" "}
                <Link href="/register" className="text-primary font-semibold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
