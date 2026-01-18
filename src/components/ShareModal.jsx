import { useState } from 'react';
import { X, Link, Copy, Check, Users } from 'lucide-react';

const ShareModal = ({ file, isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('viewer');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!isOpen || !file) return null;

  const handleShare = () => {
    if (!email) return;
    
    // Generate fake share link
    const fakeLink = `https://cloudnest.app/share/${file.id}-${Date.now().toString(36)}`;
    setShareLink(fakeLink);
    setShared(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShared(false);
      setEmail('');
    }, 3000);
  };

  const handleCopyLink = () => {
    const link = shareLink || `https://cloudnest.app/share/${file.id}-${Date.now().toString(36)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    if (!shareLink) setShareLink(link);
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setEmail('');
    setShareLink('');
    setCopied(false);
    setShared(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Share "{file.name}"
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Share with email */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Users size={16} />
              Share with people
            </label>
            
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field flex-1"
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="input-field w-32"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>

            <button
              onClick={handleShare}
              disabled={!email}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {shared ? (
                <span className="flex items-center justify-center gap-2">
                  <Check size={18} />
                  Shared!
                </span>
              ) : (
                'Share'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Copy link */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Link size={16} />
              Get shareable link
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareLink || 'Click to generate link...'}
                className="input-field flex-1 bg-secondary text-muted-foreground"
              />
              <button
                onClick={handleCopyLink}
                className="btn-secondary flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
