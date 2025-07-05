type Props = {
  show: boolean;
  close: () => void;
  handleUpload: (e: React.FormEvent) => void;
  setFile: (file: File | null) => void;
  uploading: boolean;
};

import { FileUpload } from "./file-upload";

export default function NewFileModal({ show, close, handleUpload, setFile, uploading }: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-black w-96 p-4 rounded-lg space-y-4">
        <div className="flex items-center justify-end">
          <button onClick={close} className="text-white text-xl hover:text-red-400 transition cursor-pointer">×</button>
        </div>

        <form onSubmit={handleUpload} className="flex flex-col space-y-2">
          <FileUpload onChange={(files: File[]) => setFile(files[0] || null)} />
          <button
            type="submit"
            disabled={uploading}
            className="bg-[#008abc] text-white px-4 py-2 rounded-lg hover:bg-[#045c7c] cursor-pointer"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
