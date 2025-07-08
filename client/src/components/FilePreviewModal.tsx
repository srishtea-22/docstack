import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    show: boolean;
    close: () => void;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: string;
}

type IconWithTooltipProps = {
  label: string;
  children: React.ReactNode;
};

const IconWithTooltip: React.FC<IconWithTooltipProps> = ({ label, children }) => (
  <div className="relative group">
    <button className="p-2 rounded-full hover:bg-white/10 cursor-pointer">
      {children}
    </button>
    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
      {label}
    </span>
  </div>
);


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
              <div className="flex gap-6 justify-end mt-6">
                <div className="relative group">
                  <IconWithTooltip label='Preview'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" aria-labelledby="preview" />
                    </svg>
                  </IconWithTooltip>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Preview
                  </span>
                </div>
                <IconWithTooltip label='Download'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                </IconWithTooltip>
                <IconWithTooltip label='Share'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg>
                </IconWithTooltip>
                <IconWithTooltip label='Delete'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
                </IconWithTooltip>
              </div>
            </div>
        </motion.div>
        )}
        </AnimatePresence>
    );
}