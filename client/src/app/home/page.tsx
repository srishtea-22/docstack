'use client';
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("File uploaded successfully!");
    } else {
      setMessage(data.error || "Upload failed");
    }

    setUploading(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="p-4 font-[family-name:var(--font-geist-mono)]">
      {username ? (
        <>
          <h1 className="text-xl font-bold">Welcome, {username}!</h1>
          <form onSubmit={handleUpload} className="my-4 flex flex-col space-y-2">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </form>
          {message && <p className="text-sm text-gray-700">{message}</p>}
          <button
            className="text-red-500 hover:underline mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <h1 className="text-xl text-red-500">You are not logged in</h1>
      )}
    </main>
  );
}
