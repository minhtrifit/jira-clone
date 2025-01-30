"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
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
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/firebase.auth";
import { toast } from "react-toastify";
import Link from "next/link";

interface LOGIN_FORM_TYPE {
  email: string;
  password: string;
}

const LoginCpn = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  // const { loading }: any = useAuth();
  const router = useRouter();

  const [loginForm, setLoginForm] = useState<LOGIN_FORM_TYPE>({
    email: "",
    password: "",
  });
  const [loginFormError, setLoginFormError] = useState<LOGIN_FORM_TYPE>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginFormError = (
    loginForm: LOGIN_FORM_TYPE,
    setLoginFormError: Dispatch<SetStateAction<LOGIN_FORM_TYPE>>
  ) => {
    let isError: boolean = false;
    let loginFormErrObj: LOGIN_FORM_TYPE = {
      email: "",
      password: "",
    };

    if (loginForm.email === "") {
      loginFormErrObj = { ...loginFormErrObj, email: "Email can not be empty" };
      isError = true;
    }

    if (loginForm.password === "") {
      loginFormErrObj = {
        ...loginFormErrObj,
        password: "Password can not be empty",
      };
      isError = true;
    }

    setLoginFormError(loginFormErrObj);
    return isError;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const isFormError: boolean = handleLoginFormError(
        loginForm,
        setLoginFormError
      );

      if (isFormError) return;

      setLoading(true);

      await signIn(loginForm.email, loginForm.password);
      router.push("/workspace");
      toast.success("Login successfully!");

      setLoginForm({ email: "", password: "" });
      setLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Email or password wrong!");
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <div className="w-full flex items-center justify-center gap-1">
        <Image src="/logo.png" width={80} height={80} alt="app-logo" />
        <h1 className="font-bold text-[1.2rem] uppercase">
          {process.env.NEXT_PUBLIC_APP_NAME
            ? process.env.NEXT_PUBLIC_APP_NAME
            : "Jira Clone"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardDescription className="text-center">
            Log in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              handleLogin(e);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user-demo@example.com"
                  value={loginForm.email}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, email: e.target.value });
                    setLoginFormError({ ...loginFormError, email: "" });
                  }}
                />
                {loginFormError.email && (
                  <span className="text-[0.85rem] text-red-500">
                    {loginFormError.email}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, password: e.target.value });
                    setLoginFormError({ ...loginFormError, password: "" });
                  }}
                />
                {loginFormError.password && (
                  <span className="text-[0.85rem] text-red-500">
                    {loginFormError.password}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </Button>
              <div className="relative text-center text-[0.7rem] after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      fill="currentColor"
                    />
                  </svg>
                  Login with GitHub
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
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

export default LoginCpn;
