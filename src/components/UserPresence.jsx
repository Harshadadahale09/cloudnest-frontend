import { useState, useEffect } from 'react';
import { Users, Circle } from 'lucide-react';

// Simulated online users
const simulatedUsers = [
  { id: 1, name: 'Alice Johnson', avatar: 'A', color: 'bg-emerald-500', status: 'online' },
  { id: 2, name: 'Bob Smith', avatar: 'B', color: 'bg-blue-500', status: 'online' },
  { id: 3, name: 'Carol White', avatar: 'C', color: 'bg-purple-500', status: 'away' },
  { id: 4, name: 'David Lee', avatar: 'D', color: 'bg-amber-500', status: 'online' },
];

const UserPresence = ({ compact = false }) => {
  const [users, setUsers] = useState(simulatedUsers.slice(0, 2));
  const [showDropdown, setShowDropdown] = useState(false);

  // Simulate users joining/leaving
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prev => {
        // Randomly add or remove a user
        if (Math.random() > 0.5 && prev.length < simulatedUsers.length) {
          const availableUsers = simulatedUsers.filter(u => !prev.find(p => p.id === u.id));
          if (availableUsers.length > 0) {
            return [...prev, availableUsers[0]];
          }
        } else if (prev.length > 1) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const onlineCount = users.filter(u => u.status === 'online').length;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <div className="flex -space-x-2">
          {users.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className={`w-6 h-6 rounded-full ${user.color} flex items-center justify-center text-xs text-white font-medium ring-2 ring-card`}
              title={user.name}
            >
              {user.avatar}
            </div>
          ))}
        </div>
        {users.length > 3 && (
          <span className="text-xs text-muted-foreground ml-1">+{users.length - 3}</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
      >
        <Users size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{onlineCount} online</span>
        <div className="flex -space-x-1">
          {users.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className={`w-5 h-5 rounded-full ${user.color} flex items-center justify-center text-[10px] text-white font-medium ring-1 ring-card`}
            >
              {user.avatar}
            </div>
          ))}
        </div>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-xl card-shadow-hover border border-border z-50 py-2 animate-fade-in">
            <div className="px-3 py-2 border-b border-border">
              <h4 className="text-sm font-semibold text-foreground">Team Members</h4>
              <p className="text-xs text-muted-foreground">{onlineCount} currently online</p>
            </div>
            <ul className="py-1">
              {users.map((user) => (
                <li key={user.id} className="px-3 py-2 flex items-center gap-3 hover:bg-secondary transition-colors">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-sm text-white font-medium`}>
                      {user.avatar}
                    </div>
                    <Circle 
                      size={10} 
                      className={`absolute -bottom-0.5 -right-0.5 fill-current ${
                        user.status === 'online' ? 'text-emerald-500' : 'text-amber-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPresence;
