import React from 'react';
import { Layout } from '@/components/Layout';
import { KYCForm } from '@/components/KYCForm';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Register = () => {
  const { toast } = useToast();

  const handleKYCSubmit = async (data: Record<string, any>) => {
    try {
      // TODO: Submit to backend API
      console.log('KYC Data:', data);
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Registration Successful!",
        description: "Your KYC form has been submitted for review.",
      });
      
      // Redirect to login or pending verification page
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Join MLM Platform
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete your KYC to get started with earning opportunities
          </p>
          <div className="mt-4">
            <Link to="/login" className="text-sm text-primary hover:text-primary-glow">
              Already have an account? Sign in
            </Link>
          </div>
        </div>

        {/* KYC Form */}
        <KYCForm onSubmit={handleKYCSubmit} />
      </div>
    </Layout>
  );
};

export default Register;