import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    show: boolean;
    close: () => void;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: string;
}

export default function FilePreviewModal({ show, close, fileName, fileType, fileSize, createdAt }: Props) {
    return (
        <AnimatePresence>
        {show && (
            <motion.div 
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.95}}
                transition={{duration: 0.2}}>
            <div className="bg-black w-[90%] max-w-md p-6 rounded-2xl space-y-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold truncate">{fileName}</h3>
                <button
                  onClick={close}
                  className="text-2xl hover:text-red-400 transition cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex gap-1">
                  <span className="text-gray-300">File Type:</span>
                  <span>{fileType}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-gray-300">File Size:</span>
                  <span>{(fileSize / 1024).toFixed(2)} kB</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-gray-300">Created At:</span>
                  <span>
                    {new Date(createdAt).toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>
        </motion.div>
        )}
        </AnimatePresence>
    );
}