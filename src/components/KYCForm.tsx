import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomButton } from '@/components/ui/custom-button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Upload, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KYCField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: any;
  options?: { value: string; label: string }[];
  accept?: string;
  maxSize?: string;
}

interface KYCSection {
  id: string;
  title: string;
  description: string;
  fields: KYCField[];
}

interface KYCSchema {
  version: string;
  sections: KYCSection[];
}

interface KYCFormProps {
  onSubmit: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
}

export const KYCForm = ({ onSubmit, initialData = {} }: KYCFormProps) => {
  const [schema, setSchema] = useState<KYCSchema | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/kycSchema.json')
      .then(res => res.json())
      .then(setSchema)
      .catch(console.error);
  }, []);

  const validateField = (field: KYCField, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }
    
    if (value && field.validation) {
      const { pattern, minLength, maxLength } = field.validation;
      
      if (pattern && !new RegExp(pattern).test(value)) {
        return `${field.label} format is invalid`;
      }
      
      if (minLength && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }
      
      if (maxLength && value.length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters`;
      }
    }
    
    return null;
  };

  const validateSection = (section: KYCSection): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleNext = () => {
    if (!schema) return;
    
    const currentSectionData = schema.sections[currentSection];
    if (validateSection(currentSectionData)) {
      if (currentSection < schema.sections.length - 1) {
        setCurrentSection(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: KYCField) => {
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={cn(error && "border-destructive focus-visible:ring-destructive")}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={formData[field.id] || ''} onValueChange={(value) => handleFieldChange(field.id, value)}>
              <SelectTrigger className={cn(error && "border-destructive focus:ring-destructive")}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-accent/50 transition-colors">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                {field.accept} • Max {field.maxSize}
              </p>
              <input
                id={field.id}
                type="file"
                accept={field.accept}
                className="hidden"
                onChange={(e) => handleFieldChange(field.id, e.target.files?.[0])}
              />
            </div>
            {formData[field.id] && (
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle className="h-4 w-4" />
                {formData[field.id].name || 'File uploaded'}
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (!schema) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentSectionData = schema.sections[currentSection];
  const progress = ((currentSection + 1) / schema.sections.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {currentSection + 1} of {schema.sections.length}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            {currentSectionData.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {currentSectionData.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentSectionData.fields.map(renderField)}
          
          <div className="flex justify-between pt-6">
            <CustomButton
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </CustomButton>
            
            <CustomButton
              variant="primary"
              onClick={handleNext}
              disabled={loading}
            >
              {currentSection === schema.sections.length - 1 ? (
                loading ? 'Submitting...' : 'Submit KYC'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </CustomButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};