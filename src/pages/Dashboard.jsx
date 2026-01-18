import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Grid, List, Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import FileCard from '../components/FileCard';
import FolderCard from '../components/FolderCard';
import FolderBreadcrumbs from '../components/FolderBreadcrumbs';
import FileUpload from '../components/FileUpload';
import ShareModal from '../components/ShareModal';
import authService from '../services/authService';
import fileService from '../services/fileService';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [currentPath, setCurrentPath] = useState(['Home']);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [filesRes, foldersRes] = await Promise.all([
        fileService.getFiles(),
        fileService.getFolders()
      ]);
      setFiles(filesRes.data);
      setFolders(foldersRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleLogout = () => {
    authService.clearCurrentUser();
    navigate('/login');
  };

  const handleFileUpload = (file) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      type: file.type.split('/')[0] || 'file',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      modified: new Date().toISOString().split('T')[0]
    };
    setFiles(prev => [newFile, ...prev]);
  };

  const handleDeleteFile = (file) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
  };

  const handleNavigateFolder = (folder) => {
    setCurrentPath(prev => [...prev, folder.name]);
  };

  const handleBreadcrumbNav = (folder, index) => {
    setCurrentPath(prev => prev.slice(0, index + 1));
  };

  const filteredFiles = fileService.searchFiles(files, searchQuery);
  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, visible on desktop */}
      <aside className="hidden lg:block flex-shrink-0">
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar drawer */}
      <aside className={`fixed lg:hidden inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200`}>
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Search */}
            <div className="flex-1 relative max-w-xl">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg hover:bg-secondary transition-colors hidden sm:flex"
              >
                {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
              </button>
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="btn-primary flex items-center gap-2 py-2 px-4"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <FolderBreadcrumbs path={currentPath} onNavigate={handleBreadcrumbNav} />
          </div>

          {/* Upload zone */}
          {showUpload && (
            <div className="mb-6 animate-fade-in">
              <FileUpload onUpload={handleFileUpload} />
            </div>
          )}

          {/* Folders section */}
          {filteredFolders.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Folders</h2>
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
                {filteredFolders.map(folder => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onClick={handleNavigateFolder}
                    onDelete={(f) => setFolders(prev => prev.filter(x => x.id !== f.id))}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Files section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Files</h2>
            {filteredFiles.length > 0 ? (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
                {filteredFiles.map(file => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onShare={setShareFile}
                    onDelete={handleDeleteFile}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No files found</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-primary mt-2 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Share Modal */}
      <ShareModal
        file={shareFile}
        isOpen={!!shareFile}
        onClose={() => setShareFile(null)}
      />
    </div>
  );
};

export default Dashboard;
