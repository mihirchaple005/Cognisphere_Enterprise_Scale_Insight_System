import { LogOut, Search, Users } from "lucide-react";
import { Button } from "./HRButton";

interface HeaderProps {
  onSignOut: () => void;
  onFindEmployees: () => void;
  onViewUsers: () => void;
}


export const Header: React.FC<HeaderProps> = ({ onSignOut, onFindEmployees, onViewUsers }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Ramdeobaba Organization</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={onViewUsers} variant="outline">
              <Users size={18} />
              Users
            </Button>
            <Button onClick={onFindEmployees} variant="secondary">
              <Search size={18} />
              Find Employees
            </Button>
            <Button onClick={onSignOut} variant="danger">
              <LogOut size={18} />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
