'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="font-[family-name:var(--font-geist-mono)] bg-[#070707] min-h-screen flex flex-col">
      <header className="p-6">
        <h1 className="text-3xl md:text-4xl text-white flex justify-end items-baseline">docstack
          <span className="text-4xl md:text-5xl text-orange-500 font-bold">.</span>
        </h1>
      </header>
      <main className="flex-grow flex md:items-center items-start justify-center relative overflow-hidden px-4 md:px-8">
        <div className="absolute z-0 bottom-0 left-0
                        w-[250px] h-[250px]
                        sm:w-[400px] sm:h-[400px] 
                        md:w-[600px] md:h-[600px] ">
            <Image
              src="/img.jpg" 
              alt="Abstract illustration with character holding folder"
              fill
              className="object-contain" 
              style={{
                objectPosition: 'bottom left' 
              }}
              priority 
              sizes="(max-width: 639px) 250px, (max-width: 767px) 400px, 600px"
            />
        </div>

        <div className="relative z-10 text-center md:text-center md:ml-auto mr-0 md:mr-32 mt-30 md:mt-0 max-w-lg flex flex-col items-center">
          <p className="text-l md:text-2xl leading-tight mb-8 text-white">
            Convenient and secure file access to all your files in one place.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-full text-l md:text-lg font-semibold hover:bg-black hover:text-white transition duration-300 cursor-pointer hover:outline hover:outline-1 hover:outline-white"
          onClick={() => router.push("/login")}>
            Get started
          </button>
        </div>
      </main>
    </div>
  );
}
