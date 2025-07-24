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
import { saveAs } from 'file-saver';

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
  referralCode: string;
  downline?: {
    level1: { id: string; name: string }[];
    level2: { id: string; name: string }[];
    level3: { id: string; name: string }[];
    level4: { id: string; name: string }[];
    level5: { id: string; name: string }[];
    level6: { id: string; name: string }[];
    level7: { id: string; name: string }[];
  };
  hasWithdrawal?: boolean; // Added for new mock data
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
  };
}

// More realistic names for users
const userNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Dhruv', 'Kabir', 'Ritvik', 'Aarush', 'Aryan', 'Ansh', 'Rudra', 'Om',
  'Anaya', 'Siya', 'Pari', 'Avni', 'Myra', 'Aadhya', 'Ira', 'Anvi', 'Kiara', 'Prisha',
  'Diya', 'Saanvi', 'Riya', 'Aarohi', 'Navya', 'Ishita', 'Meera', 'Sara', 'Aanya', 'Vanya',
  'Aarav Singh', 'Vivaan Patel', 'Aditya Sharma', 'Vihaan Gupta', 'Arjun Mehta', 'Sai Reddy', 'Reyansh Nair', 'Ayaan Das', 'Krishna Rao', 'Ishaan Joshi',
  'Shaurya Jain', 'Atharv Kapoor', 'Dhruv Sinha', 'Kabir Bansal', 'Ritvik Chawla', 'Aarush Malhotra', 'Aryan Khanna', 'Ansh Verma', 'Rudra Yadav', 'Om Mishra',
  'Anaya Singh', 'Siya Patel', 'Pari Sharma', 'Avni Gupta', 'Myra Mehta', 'Aadhya Reddy', 'Ira Nair', 'Anvi Das', 'Kiara Rao', 'Prisha Joshi',
  'Diya Jain', 'Saanvi Kapoor', 'Riya Sinha', 'Aarohi Bansal', 'Navya Chawla', 'Ishita Malhotra', 'Meera Khanna', 'Sara Verma', 'Aanya Yadav', 'Vanya Mishra',
  'Rahul', 'Priya', 'Suresh', 'Neha', 'Amit', 'Sunita', 'Vikram', 'Pooja', 'Rakesh', 'Sneha',
  'Manish', 'Kiran', 'Deepak', 'Swati', 'Sanjay', 'Nisha', 'Ajay', 'Ritu', 'Raj', 'Shreya'
];

// Generate 100 mock users with realistic names and MLM team structure
const mockUsers: User[] = Array.from({ length: 100 }, (_, i) => {
  const id = (i + 1).toString();
  const paid = i % 2 === 0;
  const hasWithdrawal = i % 5 === 0;
  // Assign a name from the list, loop if needed
  const name = userNames[i % userNames.length];
  // Build a more realistic MLM downline
  let downline: any = { level1: [], level2: [], level3: [], level4: [], level5: [], level6: [], level7: [] };
  // For the first 10 users, give them a team
  if (i < 10) {
    // Level 1: 2-4 direct referrals
    downline.level1 = Array.from({ length: 2 + (i % 3) }, (_, j) => {
      const refIdx = 10 + i * 3 + j;
      return {
        id: (refIdx + 1).toString(),
        name: userNames[refIdx % userNames.length]
      };
    });
    // Level 2: 1-2 indirect referrals
    downline.level2 = Array.from({ length: 1 + (i % 2) }, (_, j) => {
      const refIdx = 40 + i * 2 + j;
      return {
        id: (refIdx + 1).toString(),
        name: userNames[refIdx % userNames.length]
      };
    });
    // Level 4: 1 referral for some
    if (i % 2 === 0) {
      downline.level4 = [{ id: (80 + i).toString(), name: userNames[(80 + i) % userNames.length] }];
    }
  }
  return {
    id,
    name,
    mobile: `+91 90000000${id.padStart(2, '0')}`,
    email: `user${id}@example.com`,
    kycStatus: paid ? 'approved' : 'pending',
    totalEarnings: paid ? 10000 + i * 100 : 0,
    availableBalance: paid ? 5000 + i * 50 : 0,
    joinedDate: `2024-01-${(i % 28 + 1).toString().padStart(2, '0')}`,
    referralCode: `REF${id.padStart(3, '0')}`,
    downline,
    lastActive: `2024-07-${(i % 28 + 1).toString().padStart(2, '0')}`,
    hasWithdrawal: hasWithdrawal,
    bankDetails: {
      bankName: `Bank ${i % 3 + 1}`,
      accountNumber: `1234567890${id.padStart(3, '0')}`,
      ifscCode: `IFSC${id.padStart(6, '0')}`,
      branchName: `Branch ${i % 2 + 1}`
    }
  };
});

const mockWithdrawals = mockUsers.filter(u => u.hasWithdrawal).map((u, idx) => ({
  id: idx + 1,
  user: u.name,
  amount: 1000 + idx * 100,
  date: `2024-07-${(idx % 28 + 1).toString().padStart(2, '0')}`,
  status: idx % 3 === 0 ? 'pending' : (idx % 3 === 1 ? 'approved' : 'rejected')
}));

// Add getRank function (same as user dashboard)
function getRank(teamSize: number) {
  if (teamSize >= 50) return { name: 'Gold', color: 'bg-yellow-500 text-yellow-900' };
  if (teamSize >= 20) return { name: 'Silver', color: 'bg-gray-400 text-gray-900' };
  if (teamSize >= 100) return { name: 'Platinum', color: 'bg-blue-500 text-white' };
  return { name: 'Bronze', color: 'bg-orange-500 text-orange-900' };
}

export const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [earningsUpdate, setEarningsUpdate] = useState('');
  const [earningsOperation, setEarningsOperation] = useState<'add' | 'deduct'>('add');
  const [withdrawalUpdate, setWithdrawalUpdate] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editUserDraft, setEditUserDraft] = useState<Omit<User, 'joinedDate' | 'lastActive'> | null>(null);
  const [adminActivity, setAdminActivity] = useState<Array<{action: string, user: string, time: string}>>([
    { action: 'Admin logged in', user: 'Admin', time: 'just now' }
  ]);
  const [showTeamForUserId, setShowTeamForUserId] = useState<string | null>(null);

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
      const multiplier = earningsOperation === 'add' ? 1 : -1;
      const finalAmount = updateAmount * multiplier;
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { 
              ...user, 
              totalEarnings: Math.max(0, user.totalEarnings + finalAmount),
              availableBalance: Math.max(0, user.availableBalance + finalAmount)
            }
          : user
      ));
      
      setAdminActivity(prev => [
        { 
          action: `${earningsOperation === 'add' ? 'Added' : 'Deducted'} ₹${updateAmount.toLocaleString()}`, 
          user: selectedUser.name, 
          time: 'just now' 
        },
        ...prev
      ]);
      
      setEarningsUpdate('');
      setSelectedUser(null);
      
      toast({
        title: "Earnings Updated",
        description: `${earningsOperation === 'add' ? 'Added' : 'Deducted'} ₹${updateAmount.toLocaleString()} ${earningsOperation === 'add' ? 'to' : 'from'} user's account`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserEditSave = () => {
    if (!editUser || !editUserDraft) return;
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...editUserDraft } : u));
    setAdminActivity(prev => [
      { action: 'User Edited', user: editUserDraft.name, time: 'just now' },
      ...prev
    ]);
    setEditUser(null);
    setEditUserDraft(null);
  };
  const handleUserEditCancel = () => {
    setEditUser(null);
    setEditUserDraft(null);
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
    paidUsers: users.filter(u => u.kycStatus === 'approved').length,
    totalEarnings: users.reduce((sum, user) => sum + user.totalEarnings, 0),
    pendingWithdrawals: mockWithdrawals.filter(w => w.status === 'pending').length
  };

  // Add CSV download function
  function downloadWithdrawalsCSV() {
    const headers = ['Name', 'Bank Name', 'Account Number', 'IFSC Code', 'Branch Name', 'Amount'];
    const rows = mockWithdrawals.filter(req => req.status === 'pending').map(req => {
      const user = users.find(u => u.name === req.user);
      const bank = user && user.bankDetails ? user.bankDetails : {
        bankName: '', accountNumber: '', ifscCode: '', branchName: ''
      };
      return [
        req.user,
        bank.bankName || '',
        bank.accountNumber || '',
        bank.ifscCode || '',
        bank.branchName || '',
        req.amount
      ];
    });
    const csv = [headers, ...rows].map(r => r.map(String).map(s => `"${s.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'withdrawal_requests.csv');
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">{totalStats.paidUsers} paid</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{totalStats.totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-warning/5 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <Download className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{totalStats.pendingWithdrawals}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User List */}
              <div className="lg:col-span-2">
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
                    <div
                      key={user.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.mobile} • {user.email}</p>
                          <p className="text-xs text-muted-foreground">Referral Code: {user.referralCode}</p>
                          {user.hasWithdrawal && (
                            <span className="inline-block bg-warning/20 text-warning px-2 py-1 rounded text-xs font-semibold mt-1">Withdrawal Requested</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">₹{user.totalEarnings.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total earnings</p>
                            <p className="text-sm text-muted-foreground">Available: ₹{user.availableBalance.toLocaleString()}</p>
                          </div>
                          <Badge variant={getStatusColor(user.kycStatus) as any}>
                            {user.kycStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* User Details Modal */}
                {showUserModal && selectedUser && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                      <button className="absolute top-2 right-2 text-lg" onClick={() => setShowUserModal(false)}>&times;</button>
                      <h2 className="text-lg font-bold mb-2">User Details</h2>
                      <div className="mb-2">
                        <span className="font-medium">Name:</span> {selectedUser.name}
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Mobile:</span> {selectedUser.mobile}
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Email:</span> {selectedUser.email}
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Referral Code:</span> {selectedUser.referralCode}
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">KYC Status:</span> <Badge variant={getStatusColor(selectedUser.kycStatus) as any}>{selectedUser.kycStatus}</Badge>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Total Earnings:</span> ₹{selectedUser.totalEarnings.toLocaleString()}
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Available Balance:</span> ₹{selectedUser.availableBalance.toLocaleString()}
                      </div>
                      {/* Show paid amount */}
                      <div className="mb-2">
                        <span className="font-medium">Paid Amount:</span> ₹{selectedUser.totalEarnings.toLocaleString()}
                      </div>
                      {/* Show rank tag */}
                      <div className="mb-2">
                        {(() => {
                          const teamSize = Object.values(selectedUser.downline || {}).reduce((total, level) => total + (level?.length || 0), 0);
                          const rank = getRank(teamSize);
                          return <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rank.color}`}>{rank.name}</span>;
                        })()}
                      </div>
                      <div className="mb-4">
                        <h3 className="font-semibold mb-1">Team Details</h3>
                        {[1,2,3,4,5,6,7].map(level => (
                          <div key={level} className="mb-1">
                            <strong>Level {level}:</strong>
                            <ul className="ml-4 list-disc">
                              {(selectedUser.downline && selectedUser.downline[`level${level}`]) ? selectedUser.downline[`level${level}`].map((member: any) => (
                                <li key={member.id}>{member.name}</li>
                              )) : <li className="text-muted-foreground text-xs">No members</li>}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <CustomButton variant="outline" onClick={() => setShowUserModal(false)}>Close</CustomButton>
                        <CustomButton onClick={() => { setEditUser(selectedUser); setEditUserDraft({
                          id: selectedUser.id,
                          name: selectedUser.name,
                          mobile: selectedUser.mobile,
                          email: selectedUser.email,
                          kycStatus: selectedUser.kycStatus,
                          totalEarnings: selectedUser.totalEarnings,
                          availableBalance: selectedUser.availableBalance,
                          referralCode: selectedUser.referralCode
                        }); setShowUserModal(false); }}>Edit</CustomButton>
                      </div>
                    </div>
                  </div>
                )}
                {/* Edit User Modal (simple inline for now) */}
                {editUser && editUserDraft && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                      <h2 className="text-lg font-bold mb-4">Edit User</h2>
                      <div className="space-y-3">
                        <div>
                          <Label>Name</Label>
                          <Input value={editUserDraft.name} onChange={e => setEditUserDraft(d => d ? { ...d, name: e.target.value } : d)} />
                        </div>
                        <div>
                          <Label>Mobile</Label>
                          <Input value={editUserDraft.mobile} onChange={e => setEditUserDraft(d => d ? { ...d, mobile: e.target.value } : d)} />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input value={editUserDraft.email} onChange={e => setEditUserDraft(d => d ? { ...d, email: e.target.value } : d)} />
                        </div>
                        <div>
                          <Label>KYC Status</Label>
                          <Select value={editUserDraft.kycStatus} onValueChange={v => setEditUserDraft(d => d ? { ...d, kycStatus: v as any } : d)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Total Earnings</Label>
                          <Input type="number" value={editUserDraft.totalEarnings} onChange={e => setEditUserDraft(d => d ? { ...d, totalEarnings: parseFloat(e.target.value) } : d)} />
                        </div>
                        <div>
                          <Label>Available Balance</Label>
                          <Input type="number" value={editUserDraft.availableBalance} onChange={e => setEditUserDraft(d => d ? { ...d, availableBalance: parseFloat(e.target.value) } : d)} />
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                          <CustomButton variant="outline" onClick={handleUserEditCancel}>Cancel</CustomButton>
                          <CustomButton onClick={handleUserEditSave}>Save</CustomButton>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </CardContent>
              </Card>
            </div>

            {/* Earnings Control - Shows only when user is selected */}
            {selectedUser && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Earnings Control
                    </CardTitle>
                    <CardDescription>Add or deduct earnings for {selectedUser.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-accent/30 rounded-lg">
                      <p className="font-semibold">{selectedUser.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: ₹{selectedUser.totalEarnings.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Available: ₹{selectedUser.availableBalance.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Operation</Label>
                      <Select value={earningsOperation} onValueChange={(value: 'add' | 'deduct') => setEarningsOperation(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="add">Add (+)</SelectItem>
                          <SelectItem value="deduct">Deduct (-)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={earningsUpdate}
                        onChange={(e) => setEarningsUpdate(e.target.value)}
                      />
                    </div>

                    <CustomButton 
                      variant={earningsOperation === 'add' ? 'default' : 'destructive'}
                      className="w-full"
                      onClick={handleEarningsUpdate}
                      disabled={loading || !earningsUpdate}
                    >
                      {loading ? 'Processing...' : `${earningsOperation === 'add' ? 'Add' : 'Deduct'} ₹${earningsUpdate || '0'}`}
                    </CustomButton>

                    <CustomButton 
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedUser(null)}
                    >
                      Clear Selection
                    </CustomButton>
                  </CardContent>
                </Card>
              </div>
            )}

              {/* Recent Activity - Show when no user is selected */}
              {!selectedUser && (
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest admin actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {adminActivity.slice(0, 5).map((activity, index) => (
                          <div key={index} className="p-2 bg-accent/20 rounded text-sm">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.user} • {activity.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
                <CardDescription>See all withdrawal requests from users</CardDescription>
                <CustomButton className="mt-2" onClick={downloadWithdrawalsCSV}>Download CSV</CustomButton>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWithdrawals.filter(req => req.status === 'pending').map(req => (
                    <div key={req.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <span className="font-semibold">{req.date}</span>
                      <span className="font-semibold">{req.user}</span>
                      <span className="font-semibold text-warning">₹{req.amount.toLocaleString()} (pending)</span>
                    </div>
                  ))}
                  {mockWithdrawals.filter(req => req.status === 'pending').length === 0 && (
                    <div className="text-center text-muted-foreground">No pending withdrawal requests.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>History</CardTitle>
                <CardDescription>All user transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock history data */}
                  {[
                    { id: 1, user: 'John Doe', amount: 5000, status: '+', date: '2024-07-15' },
                    { id: 2, user: 'Alice Smith', amount: 2500, status: '-', date: '2024-07-20' },
                    { id: 3, user: 'Bob Johnson', amount: 3000, status: '-', date: '2024-07-22' },
                  ].map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <span className="font-semibold">{item.date}</span>
                      <span className="font-semibold">{item.user}</span>
                      <span className={`font-semibold ${item.status === '+' ? 'text-success' : 'text-destructive'}`}>{item.status} ₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;