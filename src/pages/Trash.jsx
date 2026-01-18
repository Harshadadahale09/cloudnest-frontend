import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, RotateCcw, AlertTriangle, Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import authService from '../services/authService';
import fileService from '../services/fileService';

const Trash = () => {
  const [trashItems, setTrashItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    try {
      const res = await fileService.getTrash();
      setTrashItems(res.data);
    } catch (err) {
      console.error('Error loading trash:', err);
    }
  };

  const handleLogout = () => {
    authService.clearCurrentUser();
    navigate('/login');
  };

  const handleRestore = (item) => {
    setTrashItems(prev => prev.filter(i => i.id !== item.id));
    // In real app, would call fileService.restoreFile(item.id)
  };

  const handlePermanentDelete = (item) => {
    if (window.confirm(`Permanently delete "${item.name}"? This cannot be undone.`)) {
      setTrashItems(prev => prev.filter(i => i.id !== item.id));
      // In real app, would call fileService.permanentDelete(item.id)
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Empty trash? All items will be permanently deleted.')) {
      setTrashItems([]);
    }
  };

  const getFileTypeIcon = (type) => {
    const colors = {
      pdf: 'bg-red-100 text-red-600',
      image: 'bg-green-100 text-green-600',
      text: 'bg-blue-100 text-blue-600',
      default: 'bg-gray-100 text-gray-600'
    };
    return colors[type] || colors.default;
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Trash2 size={20} className="text-destructive" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Trash</h1>
                  <p className="text-sm text-muted-foreground">{trashItems.length} items</p>
                </div>
              </div>
            </div>

            {trashItems.length > 0 && (
              <button
                onClick={handleEmptyTrash}
                className="btn-secondary text-destructive hover:bg-destructive/10 flex items-center gap-2 py-2 px-4"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Empty Trash</span>
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {trashItems.length > 0 ? (
            <div className="space-y-2">
              {trashItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/20 transition-colors animate-fade-in"
                >
                  {/* File type indicator */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeIcon(item.type)}`}>
                    <span className="text-xs font-medium uppercase">
                      {item.type?.slice(0, 3) || 'FILE'}
                    </span>
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.size} • Deleted {item.deletedAt}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestore(item)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      title="Restore"
                    >
                      <RotateCcw size={18} />
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(item)}
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                      title="Delete permanently"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Trash2 size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Trash is empty</h2>
              <p className="text-muted-foreground max-w-md">
                Items moved to trash will appear here. They'll be automatically deleted after 30 days.
              </p>
            </div>
          )}

          {/* Warning notice */}
          {trashItems.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Items in trash</p>
                <p className="text-sm text-amber-700 mt-1">
                  Files in trash will be automatically deleted after 30 days. Restore important files to keep them.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Trash;
