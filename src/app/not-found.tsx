import Image from "next/image";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col gap-5 items-center justify-center text-center">
      <h1 className="text-[5rem] font-bold text-primary">404</h1>

      <p className="text-[2rem] font-semibold text-gray-400 dark:text-gray-500">
        Oops...page not found
      </p>

      <Image src="/logo.png" width={300} height={300} alt="app-logo" />

      <Link href="/">
        <Button className="text-white">
          <RotateCcw size={15} /> Back to home
        </Button>
      </Link>
    </div>
  );
}
