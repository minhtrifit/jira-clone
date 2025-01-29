import AuthProtectProvider from "@/components/providers/AuthProtectProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME ?? "Jira clone"} | Workspaces`,
  description: "Developed by minhtrifit",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
