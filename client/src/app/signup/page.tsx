"use client";
import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { Label } from "@/components/label";
import { Input } from "@/components/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGoogle
} from "@tabler/icons-react";

export default function SignupForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
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
            />
        </div>

        <div className="relative z-10 md:ml-auto mr-0 md:mr-56 mt-30 md:mt-0 w-[500px] flex flex-col">
            <div className="shadow-input mx-auto w-full max-w-xl rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
                
              <form className="" onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <LabelInputContainer>
                    <Label htmlFor="firstname">First name</Label>
                    <Input id="firstname" placeholder="Tyler" type="text" />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="lastname">Last name</Label>
                    <Input id="lastname" placeholder="Durden" type="text" />
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                  <Label htmlFor="confirmpassword">Confirm password</Label>
                  <Input
                    id="confirmpassword"
                    placeholder="••••••••"
                    type="confirmpassword"
                  />
                </LabelInputContainer>
                
                <button
                  className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                  type="submit"
                >
                  Sign up
                  <BottomGradient />
                </button>
                
                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
                
                <div className="flex flex-col space-y-4">
                  {/* <button
                    className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                    type="submit"
                  >
                    <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      Google
                    </span>
                    <BottomGradient />
                  </button> */}
                  <p className="text-center">Already have an account? <Link href="/login" className="mx-auto mt-2 w-fit text-sm text-white px-4 py-2 border border-white rounded-2xl hover:text-black hover:bg-white transition duration-300 cursor-pointer">Log In</Link></p>
                </div>
              </form>
            </div>
        </div>
      </main>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};