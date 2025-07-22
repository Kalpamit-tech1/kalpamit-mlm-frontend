import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock, 
  Eye,
  Download,
  CreditCard,
  UserCheck,
  Network,
  Calendar
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  mobile: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  totalEarnings: number;
  availableBalance: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  referralCode: string;
  joinedDate: string;
  downline: {
    level1: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level2: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
  };
}

const mockUserData: UserData = {
  id: 'user123',
  name: 'John Doe',
  mobile: '+91 9876543210',
  kycStatus: 'approved',
  totalEarnings: 25650.50,
  availableBalance: 15420.75,
  totalWithdrawals: 10229.75,
  pendingWithdrawals: 2500.00,
  referralCode: 'MLM123ABC',
  joinedDate: '2024-01-15',
  downline: {
    level1: [
      { id: '1', name: 'Alice Smith', earnings: 5200.00, joinedDate: '2024-02-01' },
      { id: '2', name: 'Bob Johnson', earnings: 3150.25, joinedDate: '2024-02-15' },
      { id: '3', name: 'Carol Davis', earnings: 4850.50, joinedDate: '2024-03-01' },
    ],
    level2: [
      { id: '4', name: 'David Wilson', earnings: 2100.00, joinedDate: '2024-03-10' },
      { id: '5', name: 'Eva Brown', earnings: 1850.75, joinedDate: '2024-03-15' },
      { id: '6', name: 'Frank Miller', earnings: 2750.25, joinedDate: '2024-04-01' },
      { id: '7', name: 'Grace Lee', earnings: 1950.50, joinedDate: '2024-04-10' },
    ]
  }
};

export const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUserData(mockUserData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!userData) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Layout title={`Welcome, ${userData.name}`}>
      <div className="space-y-6">
        {/* KYC Status Alert */}
        {userData.kycStatus !== 'approved' && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-semibold">KYC Verification {userData.kycStatus === 'pending' ? 'Pending' : 'Required'}</p>
                  <p className="text-sm text-muted-foreground">
                    {userData.kycStatus === 'pending' 
                      ? 'Your documents are under review. You\'ll be notified once approved.'
                      : 'Please complete your KYC verification to start earning.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{userData.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{userData.availableBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-warning/5 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">₹{userData.pendingWithdrawals.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Under processing</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-accent border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.downline.level1.length + userData.downline.level2.length}</div>
              <p className="text-xs text-muted-foreground">
                {userData.downline.level1.length} direct + {userData.downline.level2.length} indirect
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Name:</span>
                    <span>{userData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mobile:</span>
                    <span>{userData.mobile}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">KYC Status:</span>
                    <Badge variant={getStatusColor(userData.kycStatus) as any}>
                      {userData.kycStatus.charAt(0).toUpperCase() + userData.kycStatus.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Referral Code:</span>
                    <code className="bg-accent px-2 py-1 rounded text-sm">{userData.referralCode}</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Joined:</span>
                    <span>{new Date(userData.joinedDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your account and earnings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CustomButton variant="primary" className="w-full">
                    <Download className="h-4 w-4" />
                    Request Withdrawal
                  </CustomButton>
                  <CustomButton variant="outline" className="w-full">
                    <Eye className="h-4 w-4" />
                    View Earnings Report
                  </CustomButton>
                  <CustomButton variant="outline" className="w-full">
                    <Network className="h-4 w-4" />
                    Share Referral Link
                  </CustomButton>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Level 1 Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Level 1 Team ({userData.downline.level1.length})</span>
                  </CardTitle>
                  <CardDescription>Direct referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userData.downline.level1.map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {new Date(member.joinedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">₹{member.earnings.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total earnings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Level 2 Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Network className="h-5 w-5" />
                    <span>Level 2 Team ({userData.downline.level2.length})</span>
                  </CardTitle>
                  <CardDescription>Indirect referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userData.downline.level2.map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {new Date(member.joinedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">₹{member.earnings.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total earnings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
                <CardDescription>Track your withdrawal requests and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock withdrawal history */}
                  {[
                    { id: 1, amount: 5000, status: 'completed', date: '2024-07-15', txnId: 'TXN123456' },
                    { id: 2, amount: 2500, status: 'pending', date: '2024-07-20', txnId: 'TXN123457' },
                    { id: 3, amount: 3000, status: 'processing', date: '2024-07-22', txnId: 'TXN123458' },
                  ].map((withdrawal) => (
                    <div key={withdrawal.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">₹{withdrawal.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">TXN: {withdrawal.txnId}</p>
                        <p className="text-sm text-muted-foreground">{withdrawal.date}</p>
                      </div>
                      <Badge variant={getStatusColor(withdrawal.status) as any}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </Badge>
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

export default Dashboard;