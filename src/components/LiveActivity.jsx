import { useState, useEffect } from 'react';
import { Activity, FileText, Upload, Trash2, Share2, FolderPlus } from 'lucide-react';

// Simulated live activities
const activityTypes = [
  { type: 'upload', icon: Upload, message: 'uploaded', color: 'text-emerald-500' },
  { type: 'delete', icon: Trash2, message: 'deleted', color: 'text-red-500' },
  { type: 'share', icon: Share2, message: 'shared', color: 'text-blue-500' },
  { type: 'folder', icon: FolderPlus, message: 'created folder', color: 'text-purple-500' },
];

const users = ['Alice', 'Bob', 'Carol', 'David'];
const files = ['Report.pdf', 'Presentation.pptx', 'Budget.xlsx', 'Photo.jpg', 'Notes.txt'];

const generateActivity = () => {
  const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
  const user = users[Math.floor(Math.random() * users.length)];
  const file = files[Math.floor(Math.random() * files.length)];
  
  return {
    id: Date.now(),
    user,
    file: activity.type === 'folder' ? `New Folder ${Math.floor(Math.random() * 10)}` : file,
    ...activity,
    timestamp: new Date(),
  };
};

const LiveActivity = ({ maxItems = 5 }) => {
  const [activities, setActivities] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  // Generate initial activities
  useEffect(() => {
    const initial = Array.from({ length: 3 }, () => generateActivity());
    setActivities(initial);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateActivity();
        const updated = [newActivity, ...prev].slice(0, maxItems);
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [maxItems]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const latestActivity = activities[0];

  return (
    <div className="relative">
      {/* Compact indicator */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
      >
        <Activity size={16} className="text-primary animate-pulse" />
        <span className="text-sm text-foreground">Live</span>
        {latestActivity && (
          <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[150px]">
            {latestActivity.user} {latestActivity.message}
          </span>
        )}
      </button>

      {/* Activity Panel */}
      {showPanel && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPanel(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-xl card-shadow-hover border border-border z-50 animate-fade-in overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Live Activity</h4>
              </div>
              <span className="text-xs text-muted-foreground">Real-time updates</span>
            </div>
            
            <ul className="max-h-64 overflow-y-auto">
              {activities.map((activity, index) => (
                <li 
                  key={activity.id} 
                  className={`px-4 py-3 flex items-start gap-3 hover:bg-secondary transition-colors ${
                    index === 0 ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`p-1.5 rounded-lg bg-secondary ${activity.color}`}>
                    <activity.icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span>
                      {' '}{activity.message}{' '}
                      <span className="text-primary">{activity.file}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                  {index === 0 && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveActivity;
