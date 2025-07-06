type Props = {
  show: boolean;
  close: () => void;
  folderName: string;
  setFolderName: (val: string) => void;
  handleFolderUpload: (e: React.FormEvent) => void;
};

export default function NewFolderModal({ show, close, folderName, setFolderName, handleFolderUpload }: Props) {
  if (!show) return null;

return (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-black w-[90%] max-w-md p-6 rounded-2xl space-y-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">New Folder</h3>
        <button
          onClick={close}
          className="text-white text-2xl hover:text-red-400 transition cursor-pointer"
        >
          ×
        </button>
      </div>
      <form onSubmit={handleFolderUpload} className="flex flex-col gap-6">
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder name"
          className="bg-[#1a1a1a] text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#008abc] rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="bg-[#008abc] text-white px-4 py-2 rounded-lg hover:bg-[#045c7c] transition cursor-pointer"
        >
          Create
        </button>
      </form>
    </div>
  </div>
);

}
