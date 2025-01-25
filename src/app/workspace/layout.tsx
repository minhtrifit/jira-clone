import AuthProtectProvider from "@/components/providers/AuthProtectProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jira Clone | Workspace",
  description: "Developed by minhtrifit",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProtectProvider>
      <>{children}</>
    </AuthProtectProvider>
  );
}
