import { Folder, MoreVertical, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

const FolderCard = ({ folder, onClick, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      className="file-card group animate-fade-in cursor-pointer"
      onClick={() => onClick?.(folder)}
    >
      <div className="w-full h-28 rounded-lg flex items-center justify-center mb-3 bg-primary/10">
        <Folder size={48} className="text-primary" fill="currentColor" fillOpacity={0.2} />
      </div>
      
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate text-sm" title={folder.name}>
            {folder.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {folder.itemCount} items
          </p>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
          >
            <MoreVertical size={16} className="text-muted-foreground" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-8 z-20 bg-card rounded-lg shadow-lg border border-border py-1 min-w-[140px] animate-fade-in">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Edit size={14} />
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(folder);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
