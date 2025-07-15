import { motion, AnimatePresence } from 'framer-motion';
import { tree } from 'next/dist/build/templates/app-page';
import { useState } from 'react';

type Props = {
    show: boolean;
    close: () => void;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: string;
    filePath: string;
    onDelete?: (filePath: string) => void;
}

type IconWithTooltipProps = {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const IconWithTooltip: React.FC<IconWithTooltipProps> = ({ label, children, onClick }) => (
  <div className="relative group">
    <button className="p-2 rounded-full hover:bg-white/10 cursor-pointer" onClick={onClick}>
      {children}
    </button>
    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
      {label}
    </span>
  </div>
);

export default function FilePreviewModal({ show, close, fileName, fileType, fileSize, createdAt, filePath, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [expiry, setExpiry] = useState("1h");

  const handlePreview = async (filePath: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/action/preview?filePath=${encodeURIComponent(filePath)}`, {
      credentials: 'include',
    });
    const { url } = await res.json();
    window.open(url, '_blank');
  };
  
  const handleDownload = async (filePath: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/action/download?filePath=${encodeURIComponent(filePath)}`, {
      credentials: 'include',
    });
  
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'file';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
  
  const handleDelete = async (filePath: string) => {
    setIsDeleting(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/action/delete?filePath=${encodeURIComponent(filePath)}`, {
      credentials: 'include',
    });
  
    if (res.ok) {
      onDelete?.(filePath);
      close();
    }
    setIsDeleting(false);
  }

  const generateLink = async (expiry: string, filePath: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/action/share?filePath=${encodeURIComponent(filePath)}&expiry=${expiry}`, {
      credentials: 'include',
    });
    const link = await res.text();
    setGeneratedLink(link);
  }
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
            <div className="mt-6 space-y-4">
            <div className="flex gap-6 justify-end">
              <div className="relative group">
                <IconWithTooltip label='Preview' onClick={() => handlePreview(filePath)}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" aria-labelledby="preview" />
                  </svg>
                </IconWithTooltip>
                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Preview
                </span>
              </div>
              <IconWithTooltip label='Download' onClick={() => handleDownload(filePath)}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
              </IconWithTooltip>
              <IconWithTooltip label='Share' onClick={() => setShowShareOptions(prev => !prev)}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg>
              </IconWithTooltip>
              <IconWithTooltip label="Delete" onClick={() => !isDeleting && handleDelete(filePath)}>
                {isDeleting ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
                  </svg>
                )}
              </IconWithTooltip>
            </div>
            <AnimatePresence>
              {showShareOptions && (
                <motion.div
                initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm overflow-hidden flex flex-col space-y-3">
                  <div className='text-sm mt-4'>
                    Link will expire after specified duration:
                  </div>
                  <div className="flex items-center justify-between">
                    {["1h", "6h", "1d", "7d"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setExpiry(val)}
                        className={`px-3 py-1 rounded bg-gray-800 text-white transition cursor-pointer ${
                          expiry === val ? "bg-orange-700" : ""
                        }`}>
                        {val === "1h" ? "1 hour" : val === "6h" ? "6 hours" : val === "1d" ? "1 day" : "7 days"}
                      </button>
                      ))}
                  </div>
                  <button 
                    onClick={() => generateLink(expiry, filePath)}
                    className='px-4 py-1 bg-[#008abc] rounded hover:bg-[#045c7c] transition cursor-pointer'>
                    Generate Link
                  </button>
                  {generatedLink && (
                    <div className='flex gap-2'>
                    <div className="flex-1 text-xs bg-gray-900 p-2 rounded overflow-x-auto whitespace-nowrap scrollbar-hide">
                      {generatedLink}
                    </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedLink);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                          }}
                          className='text-white hover:text-green-400 transition'>
                        {copied ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h11v16z"/></svg>
                        )}
                      </button>
                      </div>
                  )}
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
      </motion.div>
      )}
      </AnimatePresence>
  );
}