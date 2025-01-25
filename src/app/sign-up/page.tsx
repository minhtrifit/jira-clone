import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import RegisterCpn from "@/components/RegisterCpn/RegisterCpn";

export default function Home() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <nav className="absolute w-full flex items-center justify-end top-6 px-6">
        <ModeToggle />
      </nav>
      <div className="w-full max-w-sm">
        <RegisterCpn />
      </div>
    </div>
  );
}
