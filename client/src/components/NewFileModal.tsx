import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from "./file-upload";
import { useEffect } from 'react';

type Props = {
  show: boolean;
  close: () => void;
  handleFileUpload: (e: React.FormEvent) => void;
  setFile: (file: File | null) => void;
  uploading: boolean;
};

export default function NewFileModal({ show, close, handleFileUpload, setFile, uploading }: Props) {
  useEffect(() => {
    if (!uploading) close();
  }, [uploading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0, scale: 0.95}}
          transition={{duration: 0.2}}>
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-black w-96 p-4 rounded-lg space-y-4">
        <div className="flex items-center justify-end">
          <button onClick={close} className="text-white text-2xl hover:text-red-400 transition cursor-pointer">×</button>
        </div>

        <form onSubmit={handleFileUpload} className="flex flex-col space-y-2">
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
    </motion.div>
      )}
      </AnimatePresence>
  );
}
