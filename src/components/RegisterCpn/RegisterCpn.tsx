"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { cn, handleFirebaseError } from "@/lib/utils";
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

interface REGISTER_FORM_TYPE {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterCpn = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const router = useRouter();

  const [registerForm, setRegisterForm] = useState<REGISTER_FORM_TYPE>({
    email: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });
  const [registerFormError, setRegisterFormError] =
    useState<REGISTER_FORM_TYPE>({
      email: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    });
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegisterFormError = (
    registerForm: REGISTER_FORM_TYPE,
    setRegisterFormError: Dispatch<SetStateAction<REGISTER_FORM_TYPE>>
  ) => {
    let isError: boolean = false;
    let registerFormErrObj: REGISTER_FORM_TYPE = {
      email: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    };

    if (registerForm.displayName === "") {
      registerFormErrObj = {
        ...registerFormErrObj,
        displayName: "Name can not be empty",
      };
      isError = true;
    }

    if (registerForm.email === "") {
      registerFormErrObj = {
        ...registerFormErrObj,
        email: "Email can not be empty",
      };
      isError = true;
    }

    if (registerForm.password === "") {
      registerFormErrObj = {
        ...registerFormErrObj,
        password: "Password can not be empty",
      };
      isError = true;
    }

    if (registerForm.confirmPassword === "") {
      registerFormErrObj = {
        ...registerFormErrObj,
        confirmPassword: "Confirm password can not be empty",
      };
      isError = true;
    }

    setRegisterFormError(registerFormErrObj);
    return isError;
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const isFormError: boolean = handleRegisterFormError(
        registerForm,
        setRegisterFormError
      );

      if (isFormError) return;

      if (registerForm.password !== registerForm.confirmPassword) {
        toast.error("Confirm password not match");
        return;
      }

      if (registerForm.email && registerForm.password) {
        setLoading(true);

        const authRes = await signUp(
          registerForm.displayName,
          registerForm.email,
          registerForm.password
        );

        console.log(authRes);

        if (authRes?.user === null) {
          toast.error(handleFirebaseError(authRes?.message));
          setLoading(false);
          return;
        }

        if (authRes?.user !== null) {
          router.push("/");
          toast.success("Register successfully!");
        }

        setRegisterForm({
          email: "",
          displayName: "",
          password: "",
          confirmPassword: "",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Register failed:", error);
      toast.error("Something wrong!");
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
      <Card className="dark:bg-slate-900 rounded-md">
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
                <Label htmlFor="displayName">Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={registerForm.displayName}
                  onChange={(e) => {
                    setRegisterForm({
                      ...registerForm,
                      displayName: e.target.value,
                    });
                    setRegisterFormError({
                      ...registerFormError,
                      displayName: "",
                    });
                  }}
                />
                {registerFormError.displayName && (
                  <span className="text-[0.85rem] text-red-500">
                    {registerFormError.displayName}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user-demo@example.com"
                  value={registerForm.email}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, email: e.target.value });
                    setRegisterFormError({
                      ...registerFormError,
                      email: "",
                    });
                  }}
                />
                {registerFormError.email && (
                  <span className="text-[0.85rem] text-red-500">
                    {registerFormError.email}
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
                  value={registerForm.password}
                  onChange={(e) => {
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    });
                    setRegisterFormError({
                      ...registerFormError,
                      password: "",
                    });
                  }}
                />
                {registerFormError.password && (
                  <span className="text-[0.85rem] text-red-500">
                    {registerFormError.password}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm password</Label>
                </div>
                <Input
                  id="confirm-password"
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => {
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    });
                    setRegisterFormError({
                      ...registerFormError,
                      confirmPassword: "",
                    });
                  }}
                />
                {registerFormError.confirmPassword && (
                  <span className="text-[0.85rem] text-red-500">
                    {registerFormError.confirmPassword}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full text-white"
                disabled={loading}
              >
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
