"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/auth/user", {
      credentials: "include", 
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUsername(data.user.username))
      .catch(() => setUsername(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <main className="p-4 font-[family-name:var(--font-geist-mono)]">
      {username ? (
        <h1 className="text-xl font-bold">Welcome, {username}!</h1>
      ) : (
        <h1 className="text-xl text-red-500">You are not logged in</h1>
      )}

      <button className="hover: text-red-500 hover:underline" onClick={handleLogout}>Logout</button>
    </main>
  );
}
