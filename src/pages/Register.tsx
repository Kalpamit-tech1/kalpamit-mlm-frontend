import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Users, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    reference_code: ''
  });
  const [referralName, setReferralName] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check password similarity
    if (field === 'confirmPassword' || field === 'password') {
      const newData = { ...formData, [field]: value };
      setPasswordMatch(newData.password === newData.confirmPassword || newData.confirmPassword === '');
    }
    
    // Check referral code
    if (field === 'reference_code' && value.length > 0) {
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
    } else if (field === 'reference_code') {
      setReferralName('');
    }
  };

  // Function to save user data to backend
  const saveUserToBackend = async (userData) => {
    try {
      console.log('🚀 Sending data to backend:', userData);
      
      const response = await fetch('https://mlm-backend-f0h4.onrender.com/user_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Backend response status:', response.status);
      console.log('📡 Backend response ok:', response.ok);

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   console.error('❌ Backend error response:', errorData);
      //   throw new Error(errorData.message || `HTTP ${response.status}: Failed to save user data`);
      // }

      if (!response.ok) {
  const errorData = await response.json();
  console.error('❌ Backend error response:', errorData);
  console.error('❌ Full error details:', JSON.stringify(errorData, null, 2));
  throw new Error(errorData.message || `HTTP ${response.status}: Failed to save user data`);
}

// Also add this before the fetch call to see what you're sending:
console.log('📤 Request payload:', JSON.stringify(userData, null, 2));
console.log('📤 Request headers:', {
  'Content-Type': 'application/json',
});

      const result = await response.json();
      console.log('✅ Backend success response:', result);
      return result;
    } catch (error) {
      console.error('🔥 Backend API Error:', error);
      throw error;
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
      console.log('🔥 Starting registration process...');
      
      // Step 1: Create Firebase user
      console.log('1️⃣ Creating Firebase user with email:', formData.email);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Step 2: Get the Firebase UID
      const uid = userCredential.user.uid;
      console.log('2️⃣ Firebase user created successfully!');
      console.log('🆔 Firebase UID:', uid);
      console.log('📧 Firebase email:', userCredential.user.email);
      console.log('🕐 Firebase user created at:', userCredential.user.metadata.creationTime);

      // Step 3: Update Firebase user profile with display name
      console.log('3️⃣ Updating Firebase user profile...');
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });
      console.log('✅ Firebase profile updated with name:', formData.name);

      // Step 4: Prepare data for backend API
      const userData = {
        firebase_uid: uid,
        name: formData.name,
        email: formData.email,
        reference_code: formData.reference_code || null
      };

      console.log('4️⃣ Prepared data for backend:', userData);

      // Step 5: Save user data to backend
      console.log('5️⃣ Sending data to backend API...');
      const backendResponse = await saveUserToBackend(userData);
      console.log('✅ Backend API responded successfully:', backendResponse);

      // Step 6: Show success message
      toast({
        title: "Registration Successful! ✅",
        description: `Account created successfully. Firebase UID: ${uid}`,
      });

      console.log('🎉 Registration completed successfully!');
      console.log('📊 Final summary:', {
        firebaseUid: uid,
        email: formData.email,
        name: formData.name,
        referenceCode: formData.reference_code,
        backendSaved: true,
        backendResponse: backendResponse
      });

      // Step 7: Navigate to dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error('💥 Registration failed at step:', error);
      console.error('💥 Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // If Firebase user was created but backend failed, we should handle this
      // You might want to delete the Firebase user or retry the backend call
      
      toast({
        title: "Registration Failed ❌",
        description: error.message || "Please try again or contact support.",
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
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                  <Label htmlFor="reference_code">Reference Code (Optional)</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reference_code"
                      type="text"
                      placeholder="Enter reference code"
                      value={formData.reference_code}
                      onChange={(e) => handleInputChange('reference_code', e.target.value)}
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