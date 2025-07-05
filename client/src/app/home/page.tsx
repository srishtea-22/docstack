'use client';
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import NewFileModal from "@/components/NewFileModal";

interface Entity {
  id: number;
  name: string;
  mimeType: string | null;
  size: number | null;
  createdAt: string;
  publicURL: string | null;
}

export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userFiles, setUserFiles] = useState<Entity[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    if (username) {
      setLoadingFiles(true);
      fetch("http://localhost:8080/fetch/files", {
        credentials: "include",
      })
      .then((res) => {
        if (!res.ok) throw new Error("failed to fetch files");
        return res.json();
      })
      .then((data: Entity[]) => {
        setUserFiles(data);
      })
      .catch((error) => {
        console.error("error fetching files ", error);
        setFilesError(error.message || "could not load files");
      })
      .finally(() => {
        setLoadingFiles(false);
      })
    }
    else if (!loading) {
      setUserFiles([]);
      setLoadingFiles(false);
    }
  }, [username, loading]);

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
      setMessage("file uploaded successfully");
    }
    else {
      setMessage(data.error || "upload failed");
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
              <button
                onClick={() => setShowModal(true)}
                className="group w-full p-2 mb-4 bg-black text-white hover:bg-white hover:text-black outline outline-1 outline-white rounded-lg flex items-center justify-center gap-1 transition duration-300 ease-in-out transform cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" className="fill-white group-hover:fill-black transition-colors duration-300">
                  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                </svg>File
              </button>
              
              <button
                className="group w-full p-2 mb-4 bg-black text-white hover:bg-white hover:text-black outline outline-1 outline-white rounded-lg flex items-center justify-center gap-1 transition duration-300 ease-in-out transform cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" className="fill-white group-hover:fill-black transition-colors duration-300">
                  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                </svg>Folder
              </button>
              <NewFileModal
                show={showModal} 
                close={() => setShowModal(false)} 
                handleUpload={handleUpload} 
                setFile={setFile} 
                uploading={uploading}/>
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
            {loadingFiles ? (
              <p>Loading files</p>
            ) : filesError ? (
              <p>{filesError}</p>
            ) : userFiles.length === 0 ? (
              <p>No files, start by uploading one!</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 grid grid-cols-[4fr_1fr_1fr_1fr] gap-2">
                    <p className="text-base">Name</p>
                    <p className="text-sm">Type</p>
                    <p className="text-sm">Size</p>
                    <p className="text-sm">Created</p>
                    </div>
                  {userFiles.map((file) => (
                    <div key={file.id} className="bg-[#2a2a2a] hover:bg-[#343434] p-4 rounded-lg shadow-md grid grid-cols-[4fr_1fr_1fr_1fr] gap-4 cursor-pointer">
                      <p className="text-base font-semibold truncate">{file.name}</p>
                      <p className="text-sm text-[#fceeea]">{file.mimeType || '-'}</p>
                      <p className="text-sm text-[#fceeea]">{file.size ? (file.size / 1024).toFixed(2) : '-'} KB</p>
                      <p className="text-sm text-[#fceeea]">{new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
            )}
            </div>
        </>
      ) : (
        <h1 className="text-xl text-red-500">You are not logged in</h1>
      )}
    </main>
    </div>
  );
}
