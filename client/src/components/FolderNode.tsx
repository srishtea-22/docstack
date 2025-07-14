import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder } from '@/lib/types';
import { usePathname } from 'next/navigation';

const FolderNode: React.FC<{ folder: Folder }> = ({ folder }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const hasChildren = folder.children && folder.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault(); 
      setOpen(!open);
    }
  };

  useEffect(() => {
    const isDescendantPath = (folder: Folder): boolean => {
      if (pathname.includes(`/folder/${folder.id}`)) return true;
      return folder.children?.some(isDescendantPath) || false;
    };
  
    if (isDescendantPath(folder)) {
      setOpen(true);
    }
  }, [pathname, folder]);

  return (
    <div className="mb-2">
      <div className="flex items-center">
        {hasChildren ? (
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 mr-1 transform transition-transform duration-200 ${
              open ? 'rotate-90' : ''
            } cursor-pointer`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={handleClick} 
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </motion.svg>
        ) : (
          <div className="h-4 w-4 mr-1" aria-hidden="true" />
        )}

        <a
          href={`/home/folder/${folder.id}`}
          className="flex-grow cursor-pointer hover:text-orange-500 text-sm"
        >
          {folder.name}
        </a>
      </div>

      <AnimatePresence initial={false}>
        {open && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-4 overflow-hidden mt-2"
            transition={{ duration: 0.2 }}
          >
            {folder.children!.map(child => (
              <FolderNode key={child.id} folder={child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FolderNode;