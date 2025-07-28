import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
  Share2,
  Wallet,
  LogOut,
  AlertCircle
} from 'lucide-react';

interface UserData {
  id: string;
  firebase_uid: string;
  name: string;
  email: string;
  reference_code?: string;
  mobile?: string;
  sex?: string;
  state?: string;
  district?: string;
  pinCode?: string;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  planAmount?: number;
  joinedDate?: string;
  referralCode?: string;
  referredBy?: { code: string; name: string } | string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
  };
  downline?: {
    level1: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level2: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level3: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level4: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level5: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level6: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
    level7: Array<{ id: string; name: string; earnings: number; joinedDate: string }>;
  };
  payment_status?: boolean; // Added payment_status
}

export const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingSection, setEditingSection] = useState<null | 'personal' | 'bank'>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Add a type guard at the top of the component
  function isCodeObj(val: unknown): val is { code: string; name?: string } {
    return val !== null && typeof val === 'object' && 'code' in val && typeof (val as any).code === 'string';
  }

  // Fetch user data from backend
  const fetchUserData = async (firebaseUid: string) => {
    try {
      console.log('🔍 Fetching user data for Firebase UID:', firebaseUid);
      setLoading(true);
      setError(null);

      // First, let's try to ping the server to check if it's accessible
      console.log('🏓 Pinging server...');
      
      const response = await fetch(`https://mlm-backend-f0h4.onrender.com/user_data/${firebaseUid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
        cache: 'no-cache',
      });

      console.log('📡 Backend response status:', response.status);
      console.log('📡 Backend response ok:', response.ok);
      console.log('📡 Backend response headers:', response.headers);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User data not found in database. Please contact support.');
        }
        if (response.status === 0) {
          throw new Error('Network error: Cannot connect to server. Please check your internet connection.');
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Backend error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch user data`);
      }

      const result = await response.json();
      console.log('✅ Backend success response:', result);
      
      // Transform the data to match our interface
      const transformedUserData: UserData = {
        id: result.id || result.firebase_uid,
        firebase_uid: result.firebase_uid,
        name: result.name,
        email: result.email,
        referralCode: result.referral_code, // restore this
        reference_code: result.reference_code, // keep this
        referredBy: result.referred_by,
        payment_status: result.payment_status,
        mobile: result.mobile || '+91 XXXXXXXXXX',
        sex: result.sex || 'Not specified',
        state: result.state || 'Not specified',
        district: result.district || 'Not specified',
        pinCode: result.pinCode || 'Not specified',
        kycStatus: result.kycStatus || 'pending',
        planAmount: result.planAmount || 50000,
        joinedDate: result.created_at || result.joinedDate || new Date().toISOString(),
        bankDetails: result.bankDetails || {
          bankName: 'Not provided',
          accountNumber: 'Not provided',
          ifscCode: 'Not provided',
          branchName: 'Not provided'
        },
        downline: result.downline || {
          level1: [],
          level2: [],
          level3: [],
          level4: [],
          level5: [],
          level6: [],
          level7: []
        }
      };

      setUserData(transformedUserData);
      console.log('🎉 User data set successfully:', transformedUserData);

    } catch (error: any) {
      console.error('💥 Failed to fetch user data:', error);
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
      console.error('💥 Error stack:', error.stack);
      
      let errorMessage = error.message;
      
      // Handle specific error types
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = `CORS Error: Unable to connect to backend server. This might be due to:
        1. Server CORS configuration issue
        2. Network connectivity problem  
        3. Server being temporarily down
        
        The POST request worked during registration, so this might be a temporary issue.`;
      }
      
      setError(errorMessage);
      toast({
        title: "Failed to load user data",
        description: "There's a connectivity issue with the backend server. Please try again in a few moments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Auth state changed:', user);
      if (user) {
        setCurrentUser(user);
        fetchUserData(user.uid);
      } else {
        setCurrentUser(null);
        setUserData(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const [editPersonal, setEditPersonal] = useState({
    name: '',
    mobile: '',
    email: '',
    sex: '',
    state: '',
    district: '',
    pinCode: '',
  });

  const [editBank, setEditBank] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
  });

  // Update edit states when userData changes
  useEffect(() => {
    if (userData) {
      setEditPersonal({
        name: userData.name || '',
        mobile: userData.mobile || '',
        email: userData.email || '',
        sex: userData.sex || '',
        state: userData.state || '',
        district: userData.district || '',
        pinCode: userData.pinCode || '',
      });
      
      setEditBank({
        bankName: userData.bankDetails?.bankName || '',
        accountNumber: userData.bankDetails?.accountNumber || '',
        ifscCode: userData.bankDetails?.ifscCode || '',
        branchName: userData.bankDetails?.branchName || '',
      });
    }
  }, [userData]);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Unable to load dashboard</h2>
            <p className="text-muted-foreground max-w-md">{error}</p>
            <div className="flex gap-2 justify-center">
              <CustomButton 
                onClick={() => currentUser && fetchUserData(currentUser.uid)}
                variant="outline"
              >
                Try Again
              </CustomButton>
              <CustomButton 
                onClick={() => navigate('/login')}
                variant="primary"
              >
                Back to Login
              </CustomButton>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!userData) {
    return (
      <Layout title="Dashboard">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <User className="h-16 w-16 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">No user data found</h2>
            <p className="text-muted-foreground">Please contact support for assistance.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate values for stats boxes, set to 0 if payment_status is false
  const paymentStatus = userData.payment_status !== false;
  const joinedDate = new Date(userData.joinedDate || new Date());
  const currentDate = new Date();
  const elapsedDays = paymentStatus ? Math.floor((currentDate.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const remainingDays = paymentStatus ? Math.max(0, 730 - elapsedDays) : 0;
  const totalEarnings = paymentStatus ? (userData.planAmount || 50000) / 10000 * elapsedDays * 40 : 0;
  const remainingAmount = paymentStatus ? (userData.planAmount || 50000) / 10000 * remainingDays * 40 : 0;
  const totalTeam = paymentStatus && userData.downline ? Object.values(userData.downline).reduce((total, level) => total + level.length, 0) : 0;
  const availableBalance = paymentStatus ? totalEarnings * 0.8 : 0;
  
  // Determine rank based on team size
  const getRank = (teamSize: number) => {
    if (teamSize >= 50) return { name: 'Gold', color: 'bg-yellow-500 text-yellow-900' };
    if (teamSize >= 20) return { name: 'Silver', color: 'bg-gray-400 text-gray-900' };
    return { name: 'Bronze', color: 'bg-orange-500 text-orange-900' };
  };

  const handleWithdrawalRequest = () => {
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `Maximum withdrawable amount is ₹${availableBalance.toLocaleString()}`,
        variant: "destructive"
      });
      return;
    }

    // Simulate withdrawal request
    toast({
      title: "Withdrawal Requested",
      description: `Your withdrawal request for ₹${amount.toLocaleString()} has been submitted.`,
      variant: "default"
    });
    
    setWithdrawalAmount('');
    setIsWithdrawalModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userData.referralCode || userData.firebase_uid);
    toast({
      title: "Referral code copied!",
      description: "Your referral code has been copied to clipboard",
    });
  };

  const planAmountDisplay = paymentStatus ? (userData.planAmount || 50000) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Logout */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <CustomButton 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </CustomButton>
        </div>

        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Welcome, {userData.name}!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-primary" />
                  <span className="font-medium">Your Code:</span>
                  <code 
                    className="bg-accent px-2 py-1 rounded cursor-pointer hover:bg-accent/80 transition-colors"
                    onClick={() => navigator.clipboard.writeText(userData.referralCode || '')}
                    title="Click to copy"
                  >
                    {userData.referralCode || 'N/A'}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-primary" />
                  <span className="font-medium">Reference code:</span>
                  <span>{userData.reference_code ? userData.reference_code : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">Referred by:</span>
                  <span>{typeof userData.referredBy === 'object' ? userData.referredBy?.name : (userData.referredBy || 'N/A')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Status Alert */}
        {userData.payment_status === false && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-semibold">You don't have any active plan</p>
                  <p className="text-sm text-muted-foreground">
                    Complete payment to start earning today
                  </p>
                  <CustomButton variant="primary" className="mt-4">Complete Payment</CustomButton>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-br from-card to-success/10 border-success/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{availableBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{planAmountDisplay.toLocaleString()}</div>
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
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Details */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Details</span>
                  </CardTitle>
                  {editingSection !== 'personal' && (
                    <CustomButton size="sm" className="ml-2" onClick={() => setEditingSection('personal')}>Edit</CustomButton>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSection === 'personal' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Name:</span>
                        <Input 
                          className="w-40" 
                          value={editPersonal.name} 
                          onChange={e => setEditPersonal(v => ({...v, name: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Mobile:</span>
                        <Input 
                          className="w-40" 
                          value={editPersonal.mobile} 
                          onChange={e => setEditPersonal(v => ({...v, mobile: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Email:</span>
                        <Input 
                          className="w-40" 
                          value={editPersonal.email} 
                          onChange={e => setEditPersonal(v => ({...v, email: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Sex:</span>
                        <Input 
                          className="w-40" 
                          value={editPersonal.sex} 
                          onChange={e => setEditPersonal(v => ({...v, sex: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">State:</span>
                        <Input 
                          className="w-40" 
                          value={editPersonal.state} 
                          onChange={e => setEditPersonal(v => ({...v, state: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">District:</span>
                        <Input 
                          className="w-40" 
                          value={editPersonal.district} 
                          onChange={e => setEditPersonal(v => ({...v, district: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Pin Code:</span>
                        <Input 
                          className="w-40" 
                          value={editPersonal.pinCode} 
                          onChange={e => setEditPersonal(v => ({...v, pinCode: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Joining Date:</span>
                        <span>{new Date(userData.joinedDate || new Date()).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <CustomButton size="sm" variant="outline" onClick={() => setEditingSection(null)}>Cancel</CustomButton>
                        <CustomButton size="sm" onClick={() => setEditingSection(null)}>Save</CustomButton>
                      </div>
                    </>
                  ) : (
                    <>
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
                        <span>{new Date(userData.joinedDate || new Date()).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Bank Details */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Bank Details</span>
                  </CardTitle>
                  {editingSection !== 'bank' && (
                    <CustomButton size="sm" className="ml-2" onClick={() => setEditingSection('bank')}>Edit</CustomButton>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSection === 'bank' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Bank Name:</span>
                        <Input 
                          className="w-40" 
                          value={editBank.bankName} 
                          onChange={e => setEditBank(v => ({...v, bankName: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">A/C No.:</span>
                        <Input 
                          className="w-40" 
                          value={editBank.accountNumber} 
                          onChange={e => setEditBank(v => ({...v, accountNumber: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">IFSC Code:</span>
                        <Input 
                          className="w-40" 
                          value={editBank.ifscCode} 
                          onChange={e => setEditBank(v => ({...v, ifscCode: e.target.value}))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Branch Name:</span>
                        <Input 
                          className="w-40" 
                          value={editBank.branchName} 
                          onChange={e => setEditBank(v => ({...v, branchName: e.target.value}))} 
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <CustomButton size="sm" variant="outline" onClick={() => setEditingSection(null)}>Cancel</CustomButton>
                        <CustomButton size="sm" onClick={() => setEditingSection(null)}>Save</CustomButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Bank Name:</span>
                        <span className="text-right text-sm">{userData.bankDetails?.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">A/C No.:</span>
                        <span className="text-right text-sm font-mono">{userData.bankDetails?.accountNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">IFSC Code:</span>
                        <span className="text-right text-sm font-mono">{userData.bankDetails?.ifscCode}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Branch Name:</span>
                        <span className="text-right text-sm">{userData.bankDetails?.branchName}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your account and earnings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userData.payment_status === true ? (
                    <Dialog open={isWithdrawalModalOpen} onOpenChange={setIsWithdrawalModalOpen}>
                      <DialogTrigger asChild>
                        <CustomButton variant="primary" className="w-full">
                          <Download className="h-4 w-4" />
                          Request Withdrawal
                        </CustomButton>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Withdrawal</DialogTitle>
                          <DialogDescription>
                            Enter the amount you want to withdraw. Your available balance is ₹{availableBalance.toLocaleString()}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="Enter amount"
                              value={withdrawalAmount}
                              onChange={(e) => setWithdrawalAmount(e.target.value)}
                              max={availableBalance}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-sm text-muted-foreground">
                              Max Amount:
                            </Label>
                            <span className="col-span-3 text-sm font-medium">₹{availableBalance.toLocaleString()}</span>
                          </div>
                        </div>
                        <DialogFooter>
                          <CustomButton 
                            variant="outline" 
                            onClick={() => setIsWithdrawalModalOpen(false)}
                          >
                            Cancel
                          </CustomButton>
                          <CustomButton onClick={handleWithdrawalRequest}>
                            Request Withdrawal
                          </CustomButton>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <CustomButton variant="success" className="w-full bg-green-600 text-white hover:bg-green-700">
                      Complete Payment
                    </CustomButton>
                  )}
                  <CustomButton variant="outline" className="w-full" onClick={copyReferralCode}>
                    <Share2 className="h-4 w-4" />
                    Share Referral Link
                  </CustomButton>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Render all 7 levels */}
              {[1,2,3,4,5,6,7].map((level) => {
                const members = userData.downline?.[`level${level}` as keyof typeof userData.downline] as Array<{ id: string; name: string }> || [];
                return (
                  <Card key={level}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>{`Level ${level} Team (${members.length})`}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {members.length === 0 ? (
                          <p className="text-muted-foreground text-sm">No members in this level.</p>
                        ) : (
                          members.map((member) => (
                            <div key={member.id} className="p-3 bg-accent/30 rounded-lg">
                              <div className="flex justify-between items-center">
                                <p className="font-medium">{member.name}</p>
                                <Badge variant="outline" className="text-xs">
                                  ID: {member.id}
                                </Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All your transactions and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Registration Entry */}
                  <div className="flex justify-between items-center p-4 border rounded-lg bg-success/5 border-success/20">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-semibold">Account Registration</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(userData.joinedDate || new Date()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-success text-success-foreground">
                      Completed
                    </Badge>
                  </div>

                  {/* KYC Status */}
                  <div className={`flex justify-between items-center p-4 border rounded-lg ${
                    userData.kycStatus === 'approved' ? 'bg-success/5 border-success/20' : 
                    userData.kycStatus === 'pending' ? 'bg-warning/5 border-warning/20' : 
                    'bg-destructive/5 border-destructive/20'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <UserCheck className={`h-5 w-5 ${
                        userData.kycStatus === 'approved' ? 'text-success' : 
                        userData.kycStatus === 'pending' ? 'text-warning' : 
                        'text-destructive'
                      }`} />
                      <div>
                        <p className="font-semibold">KYC Verification</p>
                        <p className="text-sm text-muted-foreground">
                          Identity verification process
                        </p>
                      </div>
                    </div>
                    <Badge className={
                      userData.kycStatus === 'approved' ? 'bg-success text-success-foreground' : 
                      userData.kycStatus === 'pending' ? 'bg-warning text-warning-foreground' : 
                      'bg-destructive text-destructive-foreground'
                    }>
                      {userData.kycStatus?.charAt(0).toUpperCase() + userData.kycStatus?.slice(1) || 'Pending'}
                    </Badge>
                  </div>

                  {/* Referral Info if available */}
                  {userData.referredBy?.code && (
                    <div className="flex justify-between items-center p-4 border rounded-lg bg-primary/5 border-primary/20">
                      <div className="flex items-center space-x-3">
                        <Network className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Joined via Referral</p>
                          <p className="text-sm text-muted-foreground">
                            Referred by: {typeof userData.referredBy === 'object' ? userData.referredBy?.name : (userData.referredBy || 'N/A')}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">
                        Code: {isCodeObj(userData.referredBy) ? userData.referredBy.code : 'N/A'}
                      </Badge>
                    </div>
                  )}

                  {/* Placeholder for future transactions */}
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Your earning and withdrawal history will appear here</p>
                  </div>
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