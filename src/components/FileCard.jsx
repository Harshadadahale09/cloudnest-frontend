import { useState } from 'react';
import { FileText, Image, FileSpreadsheet, Presentation, Archive, File, Share2, Trash2, MoreVertical } from 'lucide-react';

const FileCard = ({ file, onShare, onDelete, isFolder = false }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getFileIcon = (type) => {
    const iconProps = { size: 40, className: "text-primary" };
    
    switch (type) {
      case 'pdf':
      case 'text':
        return <FileText {...iconProps} />;
      case 'image':
        return <Image {...iconProps} />;
      case 'spreadsheet':
        return <FileSpreadsheet {...iconProps} />;
      case 'presentation':
        return <Presentation {...iconProps} />;
      case 'archive':
        return <Archive {...iconProps} />;
      default:
        return <File {...iconProps} />;
    }
  };

  const getFileBackground = (type) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-50';
      case 'image':
        return 'bg-green-50';
      case 'spreadsheet':
        return 'bg-emerald-50';
      case 'presentation':
        return 'bg-orange-50';
      case 'archive':
        return 'bg-amber-50';
      case 'text':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="file-card group animate-fade-in relative">
      <div className={`w-full h-28 rounded-lg flex items-center justify-center mb-3 ${getFileBackground(file.type)}`}>
        {getFileIcon(file.type)}
      </div>
      
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate text-sm" title={file.name}>
            {file.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {file.size} • {file.modified}
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
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 bg-card rounded-lg shadow-lg border border-border py-1 min-w-[140px] animate-fade-in">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare?.(file);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Share2 size={14} />
                  Share
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(file);
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

export default FileCard;
