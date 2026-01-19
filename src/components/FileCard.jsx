import { useState } from 'react';
import { FileText, Image, FileSpreadsheet, Presentation, Archive, File, Share2, Trash2, MoreVertical, Download } from 'lucide-react';

const FileCard = ({ file, onShare, onDelete, isFolder = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  // Simulate file download with dummy content
  const handleDownload = async (e) => {
    e.stopPropagation();
    setDownloading(true);
    setShowMenu(false);

    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Create dummy content based on file type
    const dummyContent = generateDummyContent(file.type, file.name);
    const blob = new Blob([dummyContent.content], { type: dummyContent.mimeType });
    
    // Create download link and trigger
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloading(false);
  };

  // Generate dummy file content
  const generateDummyContent = (type, name) => {
    switch (type) {
      case 'pdf':
        return {
          content: `%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\n\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n\ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n199\n%%EOF\n\n[CloudNest Demo File: ${name}]`,
          mimeType: 'application/pdf'
        };
      case 'image':
        // Create a simple SVG as image placeholder
        return {
          content: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <rect fill="#f0f9ff" width="400" height="300"/>
            <text x="200" y="150" text-anchor="middle" fill="#3b82f6" font-family="Arial" font-size="20">
              CloudNest Demo Image
            </text>
            <text x="200" y="180" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="14">
              ${name}
            </text>
          </svg>`,
          mimeType: 'image/svg+xml'
        };
      case 'spreadsheet':
        return {
          content: `Date,Item,Amount,Category\n2024-01-15,Project Budget,5000,Finance\n2024-01-14,Office Supplies,250,Operations\n2024-01-13,Software License,1200,IT\n2024-01-12,Marketing Campaign,3500,Marketing\n\n[CloudNest Demo Spreadsheet: ${name}]`,
          mimeType: 'text/csv'
        };
      case 'presentation':
        return {
          content: `CloudNest Presentation Demo\n\n[Slide 1]\nTitle: ${name}\nCreated with CloudNest\n\n[Slide 2]\nKey Features:\n- Secure Cloud Storage\n- Easy File Sharing\n- Team Collaboration\n\n[Slide 3]\nThank You!\nContact: team@cloudnest.app`,
          mimeType: 'text/plain'
        };
      case 'text':
        return {
          content: `CloudNest Text Document\n${'='.repeat(40)}\n\nFile: ${name}\nCreated: ${new Date().toISOString()}\n\nThis is a demo text file downloaded from CloudNest.\nYour secure cloud storage solution.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n${'='.repeat(40)}\nCloudNest - Your files, everywhere.`,
          mimeType: 'text/plain'
        };
      default:
        return {
          content: `CloudNest Demo File\n\nFilename: ${name}\nDownloaded: ${new Date().toISOString()}\n\nThis is a placeholder file from CloudNest.`,
          mimeType: 'application/octet-stream'
        };
    }
  };

  return (
    <div className="file-card group animate-fade-in relative">
      {/* Download progress overlay */}
      {downloading && (
        <div className="absolute inset-0 bg-card/90 rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <Download size={24} className="text-primary mx-auto animate-bounce" />
            <p className="text-xs text-muted-foreground mt-2">Downloading...</p>
          </div>
        </div>
      )}

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
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  <Download size={14} />
                  Download
                </button>
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
