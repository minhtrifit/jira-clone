import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jira Clone | Sign up",
  description: "Developed by minhtrifit",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
