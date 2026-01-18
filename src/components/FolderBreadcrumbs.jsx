import { ChevronRight, Home } from 'lucide-react';

const FolderBreadcrumbs = ({ path = ['Home'], onNavigate }) => {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {path.map((folder, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight size={16} className="text-muted-foreground" />
          )}
          <button
            onClick={() => onNavigate?.(folder, index)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
              index === path.length - 1
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {index === 0 && <Home size={16} />}
            <span>{folder}</span>
          </button>
        </div>
      ))}
    </nav>
  );
};

export default FolderBreadcrumbs;
