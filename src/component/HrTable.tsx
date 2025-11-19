"use client"

import { Check } from "lucide-react";
import { Button } from "./HRButton";
import { useState } from "react";

interface User {
  uid: string;
  name: string;
  email?: string;
  department?: string;
  role?: string;
  isAccepted: boolean;
  bio?: string;
}

interface UserListTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
  onAcceptUser: (uid: string) => Promise<void>;
}

export const UserListTable: React.FC<UserListTableProps> = ({ users, onViewDetails, onAcceptUser }) => {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleAccept = async (uid: string): Promise<void> => {
    setLoadingUserId(uid);
    try {
      await onAcceptUser(uid);
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-900 border-b border-gray-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Sr. No.</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User ID</th>
            {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th> */}
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {users.map((user: User, index: number) => (
            <tr key={user.uid} className="hover:bg-gray-750 transition-colors">
              <td className="px-6 py-4 text-gray-300">{index + 1}</td>
              <td className="px-6 py-4 text-gray-300 font-mono text-sm">{user.uid}</td>
              {/* <td className="px-6 py-4 text-white font-medium">{user.name}</td> */}
              <td className="px-6 py-4 text-gray-300">{user.email || 'N/A'}</td>
              <td className="px-6 py-4 text-center">
                {user.isAccepted ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">
                    <Check size={14} />
                    Accepted
                  </span>
                ) : (
                  <Button
                    onClick={() => handleAccept(user.uid)}
                    variant="success"
                    className="text-sm py-1 px-3"
                    disabled={loadingUserId === user.uid}
                  >
                    {loadingUserId === user.uid ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        Accept
                      </>
                    )}
                  </Button>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <Button 
                  onClick={() => onViewDetails(user)}
                  variant="outline"
                  className="text-sm py-1 px-3"
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};