import { Link, useLocation } from 'react-router-dom';
import { Cloud, LayoutDashboard, Trash2, Settings, LogOut, HardDrive, Star, Clock, CreditCard } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'My Drive' },
    { path: '/dashboard?view=recent', icon: Clock, label: 'Recent' },
    { path: '/dashboard?view=starred', icon: Star, label: 'Starred' },
    { path: '/trash', icon: Trash2, label: 'Trash' },
  ];

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path && !location.search;
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl cloud-gradient flex items-center justify-center">
            <Cloud size={24} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">CloudNest</span>
        </Link>
      </div>

      {/* Storage indicator */}
      <div className="px-4 mb-4">
        <div className="p-4 bg-secondary rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Storage</span>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden mb-2">
            <div className="h-full w-3/5 cloud-gradient rounded-full" />
          </div>
          <p className="text-xs text-muted-foreground">
            7.5 GB of 15 GB used
          </p>
          <Link 
            to="/pricing" 
            className="text-xs text-primary hover:underline mt-2 inline-block font-medium"
          >
            Upgrade storage →
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Upgrade Banner */}
      <div className="px-4 mb-4">
        <Link 
          to="/pricing"
          className="block p-4 cloud-gradient rounded-xl text-primary-foreground transition-all hover:opacity-90"
        >
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={16} />
            <span className="font-semibold text-sm">Go Pro</span>
          </div>
          <p className="text-xs opacity-90">
            Get 100 GB storage & premium features
          </p>
        </Link>
      </div>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border space-y-1">
        <button className="nav-link w-full">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button 
          onClick={onLogout}
          className="nav-link w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
