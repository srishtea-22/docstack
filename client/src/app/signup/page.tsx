"use client";
import React, { useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { Label } from "@/components/label";
import { Input } from "@/components/input";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  username: z.string().min(1, {message: "Username is required"}),
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
  confirmpassword: z.string().min(8, {message: "Password must be at least 8 characters"}),
}).refine((data) => data.password === data.confirmpassword, {
  message: "Passwords don't match",
  path: ["confirmpassword"],
});

type SignUpFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setServerError("");
    setLoading(true);
    try {
      signupSchema.parse(formData);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login');
      }
      else {
        setServerError(data.message || "Signup failed")
      }
    }
    catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.errors);
      }
      else {
        setServerError("Something went wrong")
      }
    }
    finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (field: keyof SignUpFormData) => {
    const error = errors.find((err) => err.path[0] === field);
    return error ? error.message : null;
  }

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

        <div className="relative z-10 md:ml-auto mr-0 md:mr-56 mt-30 md:mt-0 w-[500px] flex flex-col">
            <div className="shadow-input mx-auto w-full max-w-xl rounded-none p-4 md:rounded-2xl md:p-8 bg-black">
                
              <form className="" onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <LabelInputContainer>
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="johndoe123" 
                      type="text"
                      value={formData.username}
                      onChange={handleChange} />
                      {getErrorMessage("username") && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage("username")}</p>
                      )}
                  </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    placeholder="johndoe@gmail.com" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange} />
                    {getErrorMessage("email") && (
                      <p className="text-red-500 text-xs mt-1">{getErrorMessage("email")}</p>
                    )}
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={formData.password}
                    onChange={handleChange} />
                    {getErrorMessage("password") && (
                      <p className="text-red-500 text-xs mt-1">{getErrorMessage("password")}</p>
                    )}
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                  <Label htmlFor="confirmpassword">Confirm password</Label>
                  <Input
                    id="confirmpassword"
                    placeholder="••••••••"
                    type="password"
                    value={formData.confirmpassword}
                    onChange={handleChange} />
                    {getErrorMessage("confirmpassword") && (
                      <p className="text-red-500 text-xs mt-1">{getErrorMessage("confirmpassword")}</p>
                    )}
                </LabelInputContainer>

                {serverError && (
                  <p className="text-red-500 text-sm mb-4 text-center">{serverError}</p>
                )}
                
              <button
                type="submit"
                className="group/btn relative block h-10 w-full rounded-md font-medium text-white  bg-zinc-800 from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] cursor-pointer flex items-center justify-center"
              >
                {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Signup"}
                <BottomGradient />
              </button>
                
                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent to-transparent via-neutral-700" />
                
                <div className="flex flex-col space-y-4">
                  <p className="text-center text-white">Already have an account? <Link href="/login" className="mx-auto mt-2 w-fit text-sm text-white px-4 py-2 border border-white rounded-2xl hover:text-black hover:bg-white transition duration-300 cursor-pointer">Log In</Link></p>
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