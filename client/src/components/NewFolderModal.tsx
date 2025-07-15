import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

type Props = {
  show: boolean;
  close: () => void;
  folderName: string;
  setFolderName: (val: string) => void;
  handleFolderUpload: (e: React.FormEvent) => void;
  creating: boolean;
};

export default function NewFolderModal({ show, close, folderName, setFolderName, handleFolderUpload, creating }: Props) {
  useEffect(() => {
    if (!creating) close();
  }, [creating]);
  return (
    <AnimatePresence>
    {show && (
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.95}}
        transition={{duration: 0.2}}>
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
            {creating ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Create"}
          </button>
        </form>
      </div>
    </motion.div>
      )}
    </AnimatePresence>
  );

}
