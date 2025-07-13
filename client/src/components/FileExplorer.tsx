'use client';
import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import NewFileModal from "@/components/NewFileModal";
import NewFolderModal from "@/components/NewFolderModal";
import FilePreviewModal from "./FilePreviewModal";

interface Entity {
  id: number;
  name: string;
  mimeType: string | null;
  size: number | null;
  createdAt: string;
  filePath: string | null;
}

export default function FileExplorer({ parentId }: { parentId: string | null }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEntities, setUserEntities] = useState<Entity[]>([]);
  const [loadingEntites, setLoadingEntities] = useState(true);
  const [entitesError, setEntitiesError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Entity | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Entity[]>([]);
  const router = useRouter();
  const params = useParams();
  const folderId = params?.id ?? null;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
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
      setLoadingEntities(true);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetch?parentId=${parentId ?? ""}`, {
        credentials: "include",
      })
      .then((res) => {
        if (!res.ok) throw new Error("failed to fetch files");
        return res.json();
      })
      .then((data: Entity[]) => {
        setUserEntities(data);
      })
      .catch((error) => {
        console.error("error fetching files ", error);
        setEntitiesError(error.message || "could not load files");
      })
      .finally(() => {
        setLoadingEntities(false);
      })
    }
    else if (!loading) {
      setUserEntities([]);
      setLoadingEntities(false);
    }
  }, [username, loading]);

  useEffect(() => {
    if (!folderId) {
      setBreadcrumbs([]);
      return;
    }
    
    async function fetchBreadcrumbs(id: string) {
      const path = [];
      while (id) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetch/entity/${id}`, {
          credentials: 'include',
        });

        const data = await res.json();
        path.unshift(data);
        id = data.parentId;
      }
      setBreadcrumbs(path);
    } 

    fetchBreadcrumbs(folderId as string);
  }, [folderId]);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  const handleFileUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("parentId", parentId || "");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/file`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    setUploading(false);
  };

  const handleFolderUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!folder)  return;

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/folder`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({folder, parentId: parentId || null,}),
    });

    setFolder("");
  }

  const handleEntityClick = (entity: Entity) => {
    if (!entity.mimeType){
        router.push(`/home/folder/${entity.id}`);
    }
    else {
      setSelectedFile(entity);
      setShowFilePreviewModal(true);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen font-[family-name:var(--font-geist-mono)]">
      <aside className="w-52 p-4 flex flex-col">
          <h1 className="text-3xl text-white flex items-baseline mb-6 ml-2">docstack
            <span className="text-4xl text-orange-500 font-bold">.</span>
          </h1>
              <button
                onClick={() => setShowFileModal(true)}
                className="group w-full py-1 mb-4 bg-black text-white hover:bg-white hover:text-black outline outline-1 outline-white rounded-lg flex items-center justify-center gap-1 transition duration-300 ease-in-out transform cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" className="fill-white group-hover:fill-black transition-colors duration-300">
                  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                </svg>
                <span className="text-sm">File</span>
              </button>
              <NewFileModal
                show={showFileModal} 
                close={() => setShowFileModal(false)} 
                handleFileUpload={handleFileUpload} 
                setFile={setFile} 
                uploading={uploading}/>
              
              <button
              onClick={() => setShowFolderModal(true)}
                className="group w-full py-1 mb-4 bg-black text-white hover:bg-white hover:text-black outline outline-1 outline-white rounded-lg flex items-center justify-center gap-1 transition duration-300 ease-in-out transform cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" className="fill-white group-hover:fill-black transition-colors duration-300">
                  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                </svg>
                <span className="text-sm">Folder</span>
              </button>
              <NewFolderModal 
                show={showFolderModal}
                close={() => setShowFolderModal(false)}
                folderName={folder}
                setFolderName={setFolder}
                handleFolderUpload={handleFolderUpload}
              />
          <div>
            {/* breadcrumbs */}
          </div>
      </aside>

    <main className="flex-1 flex flex-col p-4 overflow-auto">
      {username ? (
        <>
        <header className="flex justify-between items-center">
        {!folderId ? (
          <h2 className="ml-4 mt-2 text-l">Welcome, {username}.</h2>
        ) : (
          <nav className="ml-4 mt-2 text-l">
            <a href="/home">Home</a>
            {" > "}
            {breadcrumbs.map((folder, i) => (
              <span key={folder.id}>
                <a href={`/home/folder/${folder.id}`}>
                  {folder.name}
                </a>
                {i < breadcrumbs.length - 1 && " > "}
              </span>
            ))}
          </nav>
        )}
          <button
            className="text-red-500 cursor-pointer mt-2 flex gap-1"
            onClick={handleLogout}
          >
            Logout
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840v80q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200v80Zm160-160-56-57 103-103H360v-80h327L584-624l56-56 200 200-200 200Z"/></svg>
          </button>
        </header>
            <div className="flex-1 overflow-auto text-lg bg-[#1b1b1b] mt-8 mr-4 rounded-2xl p-4">
            {loadingEntites ? (
              <p>Loading files</p>
            ) : entitesError ? (
              <p>{entitesError}</p>
            ) : userEntities.length === 0 ? (
              <p>No files, start by uploading one!</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 grid grid-cols-[4fr_1fr_1fr] gap-2">
                    <p className="text-base">Name</p>
                    <p className="text-sm">Size</p>
                    <p className="text-sm">Created</p>
                    </div>
                  {userEntities.map((file) => (
                    <div key={file.id} className="bg-[#2a2a2a] hover:bg-[#343434] p-4 rounded-lg shadow-md grid grid-cols-[4fr_1fr_1fr] gap-4 cursor-pointer" 
                    onClick={() => handleEntityClick(file)}>
                      <p className="text-base font-semibold truncate">{file.name}</p>
                      <p className="text-sm text-[#fceeea]">{file.size ? (file.size / 1024).toFixed(2) + ' kB': '-'}</p>
                      <p className="text-sm text-[#fceeea]">{new Date(file.createdAt).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}</p>
                    </div>
                  ))}
                    <FilePreviewModal 
                    show={showFilePreviewModal}
                    close={() => setShowFilePreviewModal(false)}
                    fileName={selectedFile?.name || ""}
                    fileType={selectedFile?.mimeType || ""}
                    fileSize={selectedFile?.size || 0}
                    createdAt={selectedFile?.createdAt || ""}
                    filePath={selectedFile?.filePath || ""}
                  />
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