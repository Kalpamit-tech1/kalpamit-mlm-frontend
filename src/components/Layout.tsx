import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  title?: string;
}

export const Layout = ({ children, className, showHeader = true, title }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {showHeader && (
        <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  MLM Platform
                </h1>
              </div>
              {title && (
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              )}
            </div>
          </div>
        </header>
      )}
      <main className={cn("container mx-auto px-4 py-6", className)}>
        {children}
      </main>
    </div>
  );
};