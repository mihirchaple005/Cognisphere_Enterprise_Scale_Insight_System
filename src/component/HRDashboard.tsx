import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Card } from "./Hrcard";
import { Search, Users } from "lucide-react";
import { Button } from "./HRButton";
import { UserListTable } from "./HrTable";
import { UserDetailsModal } from "./UserdetailModal";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebaseClient";
import { useRouter } from "next/navigation";

interface User {
  uid: string;
  name: string;
  email?: string;
  department?: string;
  role?: string;
  isAccepted: boolean;
  bio?: string;
}

const HRDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router=useRouter();

  // Fetch users from API (replace with your actual API endpoint)
  useEffect(() => {
    fetchUsers();
  }, []);

 const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get("/api/user_info/all");
      if (response.data.ok) {
        console.log(response.data.users)
        setUsers(response.data.users);
      } else {
        console.error("Failed to fetch users:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user acceptance - THIS IS WHERE YOU'LL SEND AXIOS REQUEST
  const handleAcceptUser = async (uid: string): Promise<void> => {
    try {
      console.log(`Accepting user: ${uid}`);
      const response = await axios.post("/api/user_info/updateStatus", { uid: uid });

      if (response.data.ok) {
        setUsers((prevUsers: User[]) =>
          prevUsers.map((user: User) =>
            user.uid === uid ? { ...user, isAccepted: true } : user
          )
        );
        alert(`User ${uid} has been accepted!`);
      } else {
        alert(`Failed to accept user: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error accepting user:", error);
      alert("Error accepting user. Please try again.");
    }
  };

  const handleSignOut = (): void => {
    signOut(auth);
    router.replace("/auth")
    // Add your sign out logic here
    // Example: clear token, redirect to login, etc.
  };

  const handleFindEmployees = (): void => {
    console.log('Find employees clicked');
    // Add your find employees logic here
  };

  const handleViewUsers = (): void => {
    console.log('View users clicked');
    // Refresh user list or show users view
    fetchUsers();
  };

  const filteredUsers: User[] = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        onSignOut={handleSignOut}
        onFindEmployees={handleFindEmployees}
        onViewUsers={handleViewUsers}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400">Manage and approve user access to the organization</p>
        </div>

        <Card className="mb-6 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, user ID, or email..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <Button onClick={fetchUsers} variant="outline">
              Refresh
            </Button>
          </div>
        </Card>

        <Card>
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No users found</p>
            </div>
          ) : (
            <UserListTable 
              users={filteredUsers}
              onViewDetails={setSelectedUser}
              onAcceptUser={handleAcceptUser}
            />
          )}
        </Card>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-gray-400">
            Total Users: <span className="text-white font-semibold">{users.length}</span>
            {' | '}
            Pending: <span className="text-yellow-400 font-semibold">
              {users.filter((u: User) => !u.isAccepted).length}
            </span>
            {' | '}
            Accepted: <span className="text-green-400 font-semibold">
              {users.filter((u: User) => u.isAccepted).length}
            </span>
          </p>
        </div>
      </main>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default HRDashboard;