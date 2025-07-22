import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  DollarSign, 
  FileCheck, 
  Settings,
  Search,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  totalEarnings: number;
  availableBalance: number;
  joinedDate: string;
  lastActive: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    mobile: '+91 9876543210',
    email: 'john@example.com',
    kycStatus: 'approved',
    totalEarnings: 25650.50,
    availableBalance: 15420.75,
    joinedDate: '2024-01-15',
    lastActive: '2024-07-22'
  },
  {
    id: '2',
    name: 'Alice Smith',
    mobile: '+91 9876543211',
    email: 'alice@example.com',
    kycStatus: 'pending',
    totalEarnings: 5200.00,
    availableBalance: 3100.00,
    joinedDate: '2024-02-01',
    lastActive: '2024-07-21'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    mobile: '+91 9876543212',
    email: 'bob@example.com',
    kycStatus: 'rejected',
    totalEarnings: 0,
    availableBalance: 0,
    joinedDate: '2024-02-15',
    lastActive: '2024-07-20'
  }
];

export const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [earningsUpdate, setEarningsUpdate] = useState('');
  const [withdrawalUpdate, setWithdrawalUpdate] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKYCUpdate = async (userId: string, status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, kycStatus: status } : user
      ));
      
      toast({
        title: "KYC Status Updated",
        description: `User KYC has been ${status}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEarningsUpdate = async () => {
    if (!selectedUser || !earningsUpdate) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updateAmount = parseFloat(earningsUpdate);
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { 
              ...user, 
              totalEarnings: user.totalEarnings + updateAmount,
              availableBalance: user.availableBalance + updateAmount
            }
          : user
      ));
      
      setEarningsUpdate('');
      setSelectedUser(null);
      
      toast({
        title: "Earnings Updated",
        description: `Added ₹${updateAmount.toLocaleString()} to user's account`,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const totalStats = {
    totalUsers: users.length,
    totalEarnings: users.reduce((sum, user) => sum + user.totalEarnings, 0),
    pendingKYC: users.filter(user => user.kycStatus === 'pending').length,
    approvedUsers: users.filter(user => user.kycStatus === 'approved').length
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {totalStats.approvedUsers} approved
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{totalStats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Platform wide</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-warning/5 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
              <FileCheck className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{totalStats.pendingKYC}</div>
              <p className="text-xs text-muted-foreground">Require review</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-accent border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="kyc">KYC Review</TabsTrigger>
            <TabsTrigger value="earnings">Earnings Control</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all platform users</CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, mobile, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.mobile} • {user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined: {new Date(user.joinedDate).toLocaleDateString()} • 
                              Last active: {new Date(user.lastActive).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">₹{user.totalEarnings.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total earnings</p>
                        </div>
                        <Badge variant={getStatusColor(user.kycStatus) as any}>
                          {user.kycStatus}
                        </Badge>
                        <CustomButton variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                          Edit
                        </CustomButton>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>KYC Review</CardTitle>
                <CardDescription>Review and approve user KYC documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(user => user.kycStatus === 'pending').map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.mobile} • {user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(user.joinedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <CustomButton 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/admin/kyc/${user.id}`, '_blank')}
                        >
                          <FileCheck className="h-4 w-4" />
                          Review
                        </CustomButton>
                        <CustomButton 
                          variant="success" 
                          size="sm"
                          onClick={() => handleKYCUpdate(user.id, 'approved')}
                          disabled={loading}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </CustomButton>
                        <CustomButton 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleKYCUpdate(user.id, 'rejected')}
                          disabled={loading}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </CustomButton>
                      </div>
                    </div>
                  ))}
                  {users.filter(user => user.kycStatus === 'pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No pending KYC reviews</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Update Earnings */}
              <Card>
                <CardHeader>
                  <CardTitle>Update User Earnings</CardTitle>
                  <CardDescription>Add earnings to user accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select User</Label>
                    <Select onValueChange={(value) => setSelectedUser(users.find(u => u.id === value) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose user to update" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.filter(user => user.kycStatus === 'approved').map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - ₹{user.totalEarnings.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedUser && (
                    <>
                      <div className="p-3 bg-accent/30 rounded-lg">
                        <p className="font-semibold">{selectedUser.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Current earnings: ₹{selectedUser.totalEarnings.toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Amount to Add</Label>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={earningsUpdate}
                          onChange={(e) => setEarningsUpdate(e.target.value)}
                        />
                      </div>

                      <CustomButton 
                        variant="primary" 
                        className="w-full"
                        onClick={handleEarningsUpdate}
                        disabled={loading || !earningsUpdate}
                      >
                        {loading ? 'Updating...' : 'Add Earnings'}
                      </CustomButton>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Admin Activity</CardTitle>
                  <CardDescription>Latest administrative actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'KYC Approved', user: 'John Doe', time: '2 hours ago' },
                      { action: 'Earnings Added', user: 'Alice Smith', time: '4 hours ago' },
                      { action: 'Withdrawal Approved', user: 'Bob Johnson', time: '1 day ago' },
                      { action: 'KYC Rejected', user: 'Carol Davis', time: '2 days ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">User: {activity.user}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;