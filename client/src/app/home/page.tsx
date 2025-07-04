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
    <div className="flex h-screen font-[family-name:var(--font-geist-mono)]">
      <aside className="w-52 p-4 flex flex-col">
          <h1 className="text-3xl text-white flex items-baseline mb-6">docstack
            <span className="text-4xl text-orange-500 font-bold">.</span>
          </h1>
          <button className="group w-24 p-2 ml-6 bg-white text-black hover:bg-black hover:text-white rounded-lg flex items-center justify-center gap-1 transition duration-300 ease-in-out transform cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" className="fill-black group-hover:fill-white transtion-colors duration-300"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            NEW
          </button>
          <div>
            {/* breadcrumbs */}
          </div>
      </aside>

    <main className="flex-1 flex flex-col p-4 overflow-auto">
      {username ? (
        <>
        <header className="flex justify-between items-center">
          <h2 className="ml-4 mt-2">
            Welcome, {username}!
          </h2>
          <button
            className="text-red-500 cursor-pointer mt-2 flex gap-1"
            onClick={handleLogout}
          >
            Logout
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840v80q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200v80Zm160-160-56-57 103-103H360v-80h327L584-624l56-56 200 200-200 200Z"/></svg>
          </button>
        </header>
            <div className="flex-1 overflow-auto text-lg bg-[#1b1b1b] mt-8 mr-4 rounded-2xl p-4">
            </div>
          {/* <form onSubmit={handleUpload} className="my-4 flex flex-col space-y-2">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              {uploading ? "Uploading..." : "Add File"}
            </button>
          </form> */}
        </>
      ) : (
        <h1 className="text-xl text-red-500">You are not logged in</h1>
      )}
    </main>
    </div>
  );
}
