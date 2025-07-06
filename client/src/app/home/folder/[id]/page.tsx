'use client';
import { use } from "react";
import FileExplorer from "@/components/FileExplorer";

export default function FolderPage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = use(params);
    return  (
        <FileExplorer parentId={id}/>
    );
    
}