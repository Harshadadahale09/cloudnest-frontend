import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, FileText, Image, File } from 'lucide-react';

const FileUpload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validTypes = ['image/', 'application/pdf', 'text/'];
    const validFiles = files.filter(file => 
      validTypes.some(type => file.type.startsWith(type))
    );

    validFiles.forEach(file => {
      const uploadFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        progress: 0,
        status: 'uploading'
      };

      setUploadingFiles(prev => [...prev, uploadFile]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, progress: 100, status: 'complete' }
                : f
            )
          );
          onUpload?.(file);
          
          // Remove from list after 2 seconds
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.id !== uploadFile.id));
          }, 2000);
        } else {
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, progress }
                : f
            )
          );
        }
      }, 200);
    });
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Image;
    if (type === 'application/pdf' || type.startsWith('text/')) return FileText;
    return File;
  };

  const removeFile = (fileId) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="space-y-4">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt"
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload size={28} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              Drag and drop files here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse • Images, PDFs, text files
            </p>
          </div>
        </div>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map(file => {
            const Icon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border animate-fade-in"
              >
                <Icon size={20} className="text-primary flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-200"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {file.status === 'complete' ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="p-1 rounded-full hover:bg-secondary transition-colors"
                    >
                      <X size={16} className="text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
