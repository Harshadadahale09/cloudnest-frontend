import { useState } from 'react';
import { X, Send, Mail, User, Check, Loader2, FileText, Paperclip } from 'lucide-react';

const SendFileModal = ({ file, isOpen, onClose }) => {
  const [sendMethod, setSendMethod] = useState('email'); // 'email' | 'username'
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !file) return null;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUsername = (username) => {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (sendMethod === 'email' && !validateEmail(recipient)) {
      setError('Please enter a valid email address');
      return;
    }
    if (sendMethod === 'username' && !validateUsername(recipient)) {
      setError('Username must be at least 3 characters (letters, numbers, underscores)');
      return;
    }

    setSending(true);

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSending(false);
    setSent(true);

    // Auto close after showing success
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setRecipient('');
    setMessage('');
    setSending(false);
    setSent(false);
    setError('');
    setSendMethod('email');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md card-shadow-hover animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl cloud-gradient flex items-center justify-center">
              <Send size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Send File</h2>
              <p className="text-xs text-muted-foreground">Share directly with someone</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={sending}
            className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {sent ? (
            // Success State
            <div className="py-8 text-center animate-fade-in">
              <div className="w-16 h-16 cloud-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                File Sent Successfully! 🎉
              </h3>
              <p className="text-muted-foreground text-sm">
                <span className="font-medium text-primary">{file.name}</span> has been sent to{' '}
                <span className="font-medium">{recipient}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              {/* File Preview */}
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Paperclip size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                </div>
              </div>

              {/* Send Method Toggle */}
              <div className="flex gap-2 p-1 bg-secondary rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSendMethod('email');
                    setRecipient('');
                    setError('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    sendMethod === 'email'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Mail size={16} />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSendMethod('username');
                    setRecipient('');
                    setError('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    sendMethod === 'username'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <User size={16} />
                  Username
                </button>
              </div>

              {/* Recipient Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {sendMethod === 'email' ? 'Recipient Email' : 'Recipient Username'}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {sendMethod === 'email' ? <Mail size={18} /> : <User size={18} />}
                  </div>
                  <input
                    type={sendMethod === 'email' ? 'email' : 'text'}
                    value={recipient}
                    onChange={(e) => {
                      setRecipient(e.target.value);
                      setError('');
                    }}
                    placeholder={sendMethod === 'email' ? 'colleague@example.com' : 'username'}
                    className="input-field pl-10"
                    required
                    disabled={sending}
                  />
                </div>
                {error && (
                  <p className="text-xs text-destructive mt-1.5">{error}</p>
                )}
              </div>

              {/* Optional Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Message <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a note for the recipient..."
                  className="input-field resize-none h-20"
                  disabled={sending}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {message.length}/500
                </p>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={sending || !recipient}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send File
                  </>
                )}
              </button>

              {/* Info */}
              <p className="text-xs text-muted-foreground text-center">
                The recipient will receive a notification with a link to download the file.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendFileModal;
