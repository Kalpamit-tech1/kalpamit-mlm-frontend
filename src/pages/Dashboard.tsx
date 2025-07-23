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
  Download,
  CreditCard,
  UserCheck,
  Network,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Hash,
  Share2
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  mobile: string;
  email: string;
  sex: string;
  state: string;
  district: string;
  pinCode: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  planAmount: number;
  joinedDate: string;
  referralCode: string;
  referredBy: { code: string; name: string };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
  };
  downline: {
    level1: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level2: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level3: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level4: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level5: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level6: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level7: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
  };
}

const mockUserData: UserData = {
  id: 'user123',
  name: 'John Doe',
  mobile: '+91 9876543210',
  email: 'john.doe@example.com',
  sex: 'Male',
  state: 'Maharashtra',
  district: 'Mumbai',
  pinCode: '400001',
  kycStatus: 'approved',
  planAmount: 50000,
  joinedDate: '2024-01-15',
  referralCode: 'MLM123ABC',
  referredBy: { code: 'MLM456DEF', name: 'Jane Smith' },
  bankDetails: {
    bankName: 'State Bank of India',
    accountNumber: '1234567890123456',
    ifscCode: 'SBIN0001234',
    branchName: 'Mumbai Main Branch'
  },
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
    ],
    level3: [
      { id: '8', name: 'Henry Clark', earnings: 1200.00, joinedDate: '2024-04-15' },
    ],
    level4: [],
    level5: [],
    level6: [],
    level7: []
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

  // Calculate elapsed days since joining
  const joinedDate = new Date(userData.joinedDate);
  const currentDate = new Date();
  const elapsedDays = Math.floor((currentDate.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate remaining days (730 total - elapsed)
  const remainingDays = Math.max(0, 730 - elapsedDays);
  
  // Calculate total earnings (Plan Amount / 10000 x elapsed days x 40)
  const totalEarnings = (userData.planAmount / 10000) * elapsedDays * 40;
  
  // Calculate remaining amount (Plan Amount / 10000 x remaining days x 40)
  const remainingAmount = (userData.planAmount / 10000) * remainingDays * 40;
  
  // Calculate total team (all levels)
  const totalTeam = Object.values(userData.downline).reduce((total, level) => total + level.length, 0);
  
  // Determine rank based on team size
  const getRank = (teamSize: number) => {
    if (teamSize >= 50) return { name: 'Gold', color: 'bg-yellow-500 text-yellow-900' };
    if (teamSize >= 20) return { name: 'Silver', color: 'bg-gray-400 text-gray-900' };
    return { name: 'Bronze', color: 'bg-orange-500 text-orange-900' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Welcome, {userData.name}!</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-primary" />
                  <span className="font-medium">Your Code:</span>
                  <code className="bg-accent px-2 py-1 rounded">{userData.referralCode}</code>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">Referred by:</span>
                  <span>{userData.referredBy.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-primary" />
                  <span className="font-medium">Referrer Code:</span>
                  <code className="bg-accent px-2 py-1 rounded">{userData.referredBy.code}</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{userData.planAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Initial investment</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{elapsedDays} days elapsed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-warning/5 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining Days</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{remainingDays}</div>
              <p className="text-xs text-muted-foreground">Out of 730 days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining Amount</CardTitle>
              <CreditCard className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{remainingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Future earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-purple-500/5 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalTeam}</div>
                <Badge className={`text-xs ${getRank(totalTeam).color}`}>
                  {getRank(totalTeam).name}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Up to 7 levels</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Details</span>
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
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-right text-sm">{userData.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sex:</span>
                    <span>{userData.sex}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">State:</span>
                    <span>{userData.state}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">District:</span>
                    <span>{userData.district}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pin Code:</span>
                    <span>{userData.pinCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Joining Date:</span>
                    <span>{new Date(userData.joinedDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Bank Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Bank Name:</span>
                    <span className="text-right text-sm">{userData.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">A/C No.:</span>
                    <span className="text-right text-sm font-mono">{userData.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">IFSC Code:</span>
                    <span className="text-right text-sm font-mono">{userData.bankDetails.ifscCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Branch Name:</span>
                    <span className="text-right text-sm">{userData.bankDetails.branchName}</span>
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
                    <Share2 className="h-4 w-4" />
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