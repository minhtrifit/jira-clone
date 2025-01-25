"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/firebase.auth";
import { toast } from "react-toastify";
import Link from "next/link";

const RegisterCpn = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const router = useRouter();

  const [registerForm, setRegisterForm] = useState<{
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (registerForm.password !== registerForm.confirmPassword) {
        toast.error("Confirm password not match");
        return;
      }

      if (registerForm.email && registerForm.password) {
        setLoading(true);

        await signUp(registerForm.email, registerForm.password);
        router.push("/");
        toast.success("Register successfully!");

        setRegisterForm({ email: "", password: "", confirmPassword: "" });
        setLoading(false);
      }
    } catch (error) {
      console.error("Register failed:", error);
      toast.error("Something wrong!");
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="w-full flex items-center justify-center gap-1">
        <Image src="/logo.png" width={60} height={60} alt="app-logo" />
        <h1 className="font-bold text-[1.2rem] uppercase">Jira clone</h1>
      </div>
      <Card>
        <CardHeader>
          <CardDescription className="text-center">
            Sign up new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              handleRegister(e);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user-demo@example.com"
                  required
                  value={registerForm.email}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, email: e.target.value });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={registerForm.password}
                  onChange={(e) => {
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm password</Label>
                </div>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={registerForm.confirmPassword}
                  onChange={(e) => {
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    });
                  }}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Register"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default RegisterCpn;
