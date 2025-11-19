import { Check, Clock } from "lucide-react";
import { Button } from "./HRButton";
import { Card } from "./Hrcard";

interface User {
  uid: string;
  name: string;
  email?: string;
  department?: string;
  role?: string;
  isAccepted: boolean;
  bio?: string;
}

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}


export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
  if (!user) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">User Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">User ID</p>
                <p className="text-white font-medium">{user.uid}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-medium">{user.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Department</p>
                <p className="text-white font-medium">{user.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Role</p>
                <p className="text-white font-medium">{user.role || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  user.isAccepted ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {user.isAccepted ? <Check size={14} /> : <Clock size={14} />}
                  {user.isAccepted ? 'Accepted' : 'Pending'}
                </span>
              </div>
            </div>
            
            {user.bio && (
              <div>
                <p className="text-gray-400 text-sm">Bio</p>
                <p className="text-white">{user.bio}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="secondary">Close</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};