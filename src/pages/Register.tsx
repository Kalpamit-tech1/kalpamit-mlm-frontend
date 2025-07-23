import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [referralName, setReferralName] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check password similarity
    if (field === 'confirmPassword' || field === 'password') {
      const newData = { ...formData, [field]: value };
      setPasswordMatch(newData.password === newData.confirmPassword || newData.confirmPassword === '');
    }
    
    // Check referral code
    if (field === 'referralCode' && value.length > 0) {
      // TODO: Replace with actual API call
      setTimeout(() => {
        if (value === 'REF123') {
          setReferralName('John Smith');
        } else if (value === 'REF456') {
          setReferralName('Sarah Johnson');
        } else {
          setReferralName('');
        }
      }, 500);
    } else if (field === 'referralCode') {
      setReferralName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordMatch) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      // TODO: Submit to backend API
      console.log('Registration Data:', formData);
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully.",
      });
      
      // Redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 ${!passwordMatch ? 'border-destructive' : ''}`}
                      required
                    />
                  </div>
                  {!passwordMatch && formData.confirmPassword && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="referralCode"
                      type="text"
                      placeholder="Enter referral code"
                      value={formData.referralCode}
                      onChange={(e) => handleInputChange('referralCode', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {referralName && (
                    <p className="text-sm text-muted-foreground">Referred by: {referralName}</p>
                  )}
                </div>

                <CustomButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading || !passwordMatch}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </CustomButton>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-primary hover:text-primary-glow">
                  Already have an account? Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;