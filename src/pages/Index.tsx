import React from 'react';
import { Layout } from '@/components/Layout';
import { CustomButton } from '@/components/ui/custom-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  DollarSign, 
  Network, 
  CheckCircle,
  ArrowRight,
  Star,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout showHeader={false}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-glow/5 to-transparent"></div>
          <div className="relative max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Star className="h-3 w-3 mr-1" />
              Trusted MLM Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent leading-tight">
              Start Your MLM Journey Today
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful entrepreneurs building their financial future through our secure and transparent MLM platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <CustomButton variant="primary" size="lg" className="text-lg px-8 py-4">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </CustomButton>
              </Link>
              <Link to="/login">
                <CustomButton variant="outline" size="lg" className="text-lg px-8 py-4">
                  Sign In
                </CustomButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built with security, transparency, and your success in mind
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Secure & Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Bank-grade security with full KYC compliance. Your data and earnings are protected with advanced encryption.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-card to-success/5">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Transparent Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Real-time tracking of all earnings and commissions. No hidden fees, clear breakdown of all transactions.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-card to-accent">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Network className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Easy Team Building</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Powerful tools to manage and grow your network. Track your team's progress and maximize earnings.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-card to-warning/5">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/80 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Fast Withdrawals</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Quick and hassle-free withdrawals to your bank account. Most requests processed within 24 hours.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Dedicated support team available round the clock. Get help whenever you need it.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-card to-success/5">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Proven System</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Time-tested compensation plan designed for sustainable growth and long-term success.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-primary-glow/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">Join Our Growing Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-muted-foreground">Active Members</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-success mb-2">₹5 Cr+</div>
                <p className="text-muted-foreground">Total Earnings Paid</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-muted-foreground">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of successful entrepreneurs who have transformed their lives with our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <CustomButton variant="primary" size="lg" className="text-lg px-8 py-4">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5" />
                </CustomButton>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>No setup fees • Free registration • Start earning immediately</span>
            </div>
          </div>
        </section>

        {/* Admin Access */}
        <section className="py-12 px-4 border-t bg-muted/30">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Platform administrators can access the admin panel
            </p>
            <Link to="/admin">
              <CustomButton variant="outline" size="sm">
                <Shield className="h-4 w-4" />
                Admin Login
              </CustomButton>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
