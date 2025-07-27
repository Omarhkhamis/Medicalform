import React, { useState, useEffect } from 'react';
import { FormData, FormErrors } from '../types/form';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import StepNavigation from './StepNavigation';
import { generatePDF } from '../utils/pdfGenerator';
import { FileText, CheckCircle } from 'lucide-react';

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    consultantName: '',
    patientName: '',
    phoneNumber: '',
    patientId: '',
    entryDate: '',
    age: '',
    currency: '',
    language: '',
    healthCondition: '',
    services: '',
    
    // Step 2
    firstVisit: {
      visitDate: '',
      visitDays: '',
      serviceEntries: []
    },
    secondVisit: {
      visitDate: '',
      visitDays: '',
      serviceEntries: []
    },
    
    // Step 3
    uploadedImages: [],
    externalLink: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const handleFieldChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing if field has been touched or submit attempted
    if (errors[field] && (touchedFields.has(field) || hasAttemptedSubmit)) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFieldBlur = (field: keyof FormData) => {
    setTouchedFields(prev => new Set(prev).add(field));
    
    // Validate only this field if it has been touched
    const fieldErrors = getStepErrors(currentStep);
    if (fieldErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };
  const getStepErrors = (step: number): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (step === 1) {
      if (!formData.consultantName.trim()) newErrors.consultantName = 'Consultant name is required';
      if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.patientId.trim()) newErrors.patientId = 'Patient ID is required';
      if (!formData.entryDate) newErrors.entryDate = 'Entry date is required';
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.currency) newErrors.currency = 'Currency is required';
      if (!formData.language) newErrors.language = 'Language is required';
      if (!formData.healthCondition) newErrors.healthCondition = 'Health condition is required';
      if (!formData.services) newErrors.services = 'Services is required';
    }
    
    if (step === 2) {
      if (!formData.firstVisit.visitDate) newErrors.firstVisitDate = 'First visit date is required';
      if (!formData.firstVisit.visitDays) newErrors.firstVisitDays = 'First visit days is required';
      if (!formData.secondVisit.visitDate) newErrors.secondVisitDate = 'Second visit date is required';
      if (!formData.secondVisit.visitDays) newErrors.secondVisitDays = 'Second visit days is required';
    }
    
    return newErrors;
  };

  // Only show errors for touched fields or after submit attempt
  useEffect(() => {
    if (hasAttemptedSubmit) {
      const stepErrors = getStepErrors(currentStep);
      setErrors(stepErrors);
    } else {
      // Only show errors for touched fields
      const stepErrors = getStepErrors(currentStep);
      const filteredErrors: FormErrors = {};
      
      Object.keys(stepErrors).forEach(field => {
        if (touchedFields.has(field)) {
          filteredErrors[field] = stepErrors[field];
        }
      });
      
      setErrors(filteredErrors);
    }
  }, [formData, currentStep, touchedFields, hasAttemptedSubmit]);

  const handleNext = () => {
    setHasAttemptedSubmit(true);
    const stepErrors = getStepErrors(currentStep);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => prev + 1);
      setHasAttemptedSubmit(false); // Reset for next step
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    setHasAttemptedSubmit(false); // Reset when going back
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    const stepErrors = getStepErrors(currentStep);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length > 0) return;
    
    setIsSubmitting(true);
    
    try {
      await generatePDF(formData);
      setIsSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      errors,
      onChange: handleFieldChange,
      onBlur: handleFieldBlur,
      onValidate: () => Object.keys(errors).length === 0
    };

    switch (currentStep) {
      case 1:
        return <Step1 {...stepProps} />;
      case 2:
        return <Step2 {...stepProps} />;
      case 3:
        return <Step3 {...stepProps} />;
      default:
        return <Step1 {...stepProps} />;
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">PDF Generated Successfully!</h2>
          <p className="text-gray-600">Your medical form has been generated and downloaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Medical Form</h1>
            </div>
            <p className="text-blue-100">
              Step {currentStep} of 3: Complete all sections to generate your PDF report
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {renderStep()}
            
            <StepNavigation
              currentStep={currentStep}
              totalSteps={3}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
             isValid={Object.keys(errors).length === 0}
            />
          </div>
        </div>
        
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-700 font-medium">Generating PDF...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;