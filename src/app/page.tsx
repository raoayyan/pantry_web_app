import Image from "next/image";
import Header from "@/container/header/header";
import HomePage from "@/container/home/home";
export default function Home() {
  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <HomePage />
    </main>
  );
}
