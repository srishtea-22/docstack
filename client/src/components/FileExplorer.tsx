'use client';
import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import NewFileModal from "@/components/NewFileModal";
import NewFolderModal from "@/components/NewFolderModal";
import FilePreviewModal from "./FilePreviewModal";
import FolderNode from "./FolderNode";
import { Folder } from '@/lib/types';
import { Entity } from '@/lib/types';
import Image from "next/image";
import Link from 'next/link';

export default function FileExplorer({ parentId }: { parentId: string | null }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEntities, setUserEntities] = useState<Entity[]>([]);
  const [loadingEntites, setLoadingEntities] = useState(true);
  const [entitesError, setEntitiesError] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState({
    file: null as File | null,
    folder: "",
    fileUploading: false,
    folderUploading: false,
  });
  const [modals, setModals] = useState({
    file: false,
    folder: false,
    preview: false,
  });
  const [selectedFile, setSelectedFile] = useState<Entity | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Entity[]>([]);
  const [folderTree, setFolderTree] = useState<Folder[]>([]);
  const [deletingFolderId, setDeletingFolderId] = useState<number | null>(null);
  const router = useRouter();
  const params = useParams();
  const folderId = params?.id ?? null;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          setUsername(null);
          return;
        }
        const data = await res.json();
        setUsername(data.user.username);
      })
      .catch(() => setUsername(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (username) {
      setLoadingEntities(true);
      const query = parentId !== null ? `?parentId=${parentId}` : "";
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetch${query}`, {
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            setEntitiesError(errorData.error || "Failed to fetch files.");
            setUserEntities([]);
            return;
          }
          const data: Entity[] = await res.json();
          setUserEntities(data);
          setEntitiesError(null); 
        })
        .catch((error) => {
          console.error("error fetching files", error);
          setEntitiesError(error.message || "Could not load files");
          setUserEntities([]);
        })
        .finally(() => {
          setLoadingEntities(false);
        });
    } else if (!loading) {
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

  useEffect(() => {
    const fetchFolderTree = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetch/folderTree`, {credentials: 'include'});
      const data = await res.json();
      setFolderTree(data);
    }
    fetchFolderTree();
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  const handleFileUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadState.file){
      setUploadState(prev => ({...prev, fileUploading: false}));
      return};

    setUploadState(prev => ({...prev, fileUploading: true}));

    const formData = new FormData();
    formData.append("file", uploadState.file);
    formData.append("parentId", parentId || "");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/file`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    const newFile = data.entity;
    setUserEntities(prev => [newFile, ...prev]);
    setUploadState(prev => ({...prev, fileUploading: false}));
  };

  const handleFolderUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadState.folder)  return;

    setUploadState(prev => ({...prev, folderUploading: true}));

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/folder`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({folder: uploadState.folder, parentId: parentId || null,}),
    });

    setUploadState(prev => ({...prev, folder: ""}));
    const data = await res.json();
    const newFile = data.entity;
    setUserEntities(prev => [newFile, ...prev]);
    setUploadState(prev => ({...prev, folderUploading: false}));
  }

  const handleEntityClick = (entity: Entity) => {
    if (!entity.mimeType){
        router.push(`/home/folder/${entity.id}`);
    }
    else {
      setSelectedFile(entity);
      setModals(prev => ({...prev, preview: true}));
    }
  }

  const handleFolderDelete = async (folderId: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/action/delete/folder?id=${folderId}`, {
      credentials: 'include',
    });
    setUserEntities(prev => prev.filter(entity => entity.id !== folderId));
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="h-10 w-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!username) return (
    <div className="flex items-center justify-center h-screen w-screen flex-col font-[family-name:var(--font-geist-mono)]">
      <h1 className="text-red-500 font-[family-name:var(--font-geist-mono)]">You are not logged in!</h1>
      <Link href="/login" className="mx-auto mt-2 w-fit text-sm text-white px-4 py-2 border border-white rounded-2xl hover:text-black hover:bg-white transition duration-300 cursor-pointer"> Back to Log In</Link>
    </div>
  )

  return (
    <div className="flex h-screen font-[family-name:var(--font-geist-mono)] bg-black text-white">
      <aside className="w-52 p-4 flex flex-col">
          <h1 className="text-3xl text-white flex items-baseline mb-6 ml-2">docstack
            <span className="text-4xl text-orange-500 font-bold">.</span>
          </h1>
              <button
                onClick={() => setModals(prev => ({...prev, file: true}))}
                className="group w-full py-1 mb-4 bg-black text-white hover:bg-white hover:text-black outline outline-1 outline-white rounded-lg flex items-center justify-center gap-1 transition duration-300 ease-in-out transform cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" className="fill-white group-hover:fill-black transition-colors duration-300">
                  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                </svg>
                <span className="text-sm">File</span>
              </button>
              <NewFileModal
                show={modals.file} 
                close={() => setModals(prev => ({...prev, file: false}))} 
                handleFileUpload={handleFileUpload} 
                setFile={(file) => setUploadState(prev => ({...prev, file}))} 
                uploading={uploadState.fileUploading}/>
              
              <button
              onClick={() => setModals(prev => ({...prev, folder: true}))}
                className="group w-full py-1 mb-4 bg-black text-white hover:bg-white hover:text-black outline outline-1 outline-white rounded-lg flex items-center justify-center gap-1 transition duration-300 ease-in-out transform cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" className="fill-white group-hover:fill-black transition-colors duration-300">
                  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                </svg>
                <span className="text-sm">Folder</span>
              </button>
              <NewFolderModal 
                show={modals.folder}
                close={() => setModals(prev => ({...prev, folder: false}))}
                folderName={uploadState.folder}
                setFolderName={(name) => setUploadState(prev => ({...prev, folder: name}))}
                handleFolderUpload={handleFolderUpload}
                creating={uploadState.folderUploading}
              />
            <div>
              <div className="font-bold mb-2 mt-2 hover:text-orange-500">
                <a href="/home" className="pl-2">Home</a>
              </div>

              {folderTree.map(folder => (
                <FolderNode key={folder.id} folder={folder} />
              ))}
            </div>
      </aside>

    <main className="flex-1 flex flex-col p-4 overflow-auto">
        <header className="flex justify-between items-center">
        {!folderId ? (
          <h2 className="ml-4 mt-2 text-l">Welcome, {username}.</h2>
        ) : (
          <nav className="ml-4 mt-2 text-l">
            <a href="/home" className="hover:text-orange-500">Home</a>
            {" > "}
            {!entitesError && breadcrumbs.map((folder, i) => (
              <span key={folder.id}>
                <a href={`/home/folder/${folder.id}`} className="hover:text-orange-500">
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
              <div className="flex items-center justify-center h-full">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : entitesError ? (
              <div className="flex items-center justify-center flex-col h-full gap-4">
                <Image
                  src="/nofolder.png"
                  alt="Empty folder illustration"
                  className="object-contain" 
                  priority 
                  height="100"
                  width="100"
                />
                <p>Folder does not exist</p>
              </div>
            ) : userEntities.length === 0 ? (
              <div className="flex items-center justify-center flex-col h-full">
                <Image
                  src="/empty.png"
                  alt="Empty folder illustration"
                  className="object-contain" 
                  priority 
                  height="100"
                  width="100"
                />
                <p>No files are folders to display</p>
              </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 grid grid-cols-[4fr_1fr_1fr_auto] gap-2">
                    <p className="text-base">Name</p>
                    <p className="text-sm -pr-2">Size</p>
                    <p className="text-sm">Created</p>
                    <span className="block w-[24px]" />
                    </div>
                  {userEntities.map((entity) => (
                  <div
                    key={entity.id}
                    className="bg-[#2a2a2a] hover:bg-[#343434] p-4 rounded-lg shadow-md grid grid-cols-[4fr_1fr_1fr_auto] gap-4 cursor-pointer group"
                    onClick={() => handleEntityClick(entity)}>
                    <p className="text-base truncate">{entity.name}</p>
                    <p className="text-sm text-[#fceeea]">
                      {entity.size ? (entity.size / 1024).toFixed(2) + " kB" : "-"}
                    </p>
                    <p className="text-sm text-[#fceeea]">
                      {new Date(entity.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex">
                      {!entity.mimeType ? (
                        <button className="cursor-pointer peer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingFolderId(entity.id);
                              handleFolderDelete(entity.id).finally(() => setDeletingFolderId(null));
                          }}>
                            {deletingFolderId === entity.id ? (
                              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                className="fill-white opacity-0 group-hover:opacity-100 hover:fill-orange-500 transition-all">
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
                              </svg>
                            )}
                        </button>
                      ) : (
                        <span className="block w-[24px]" />
                      )}
                    </div>
                  </div>
                  ))}
                    <FilePreviewModal 
                    show={modals.preview}
                    close={() => setModals(prev => ({...prev, preview: false}))}
                    fileName={selectedFile?.name || ""}
                    fileType={selectedFile?.mimeType || ""}
                    fileSize={selectedFile?.size || 0}
                    createdAt={selectedFile?.createdAt || ""}
                    filePath={selectedFile?.filePath || ""}
                    onDelete={(deletedPath) => {
                      setUserEntities(prev => prev.filter(file => file.filePath !== deletedPath));
                    }}
                  />
                </div>
            )}
            </div>
    </main>
    </div>
  );
}