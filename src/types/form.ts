export interface FormData {
  // Step 1: Personal Information
  consultantName: string;
  patientName: string;
  phoneNumber: string;
  patientId: string;
  entryDate: string;
  age: number | '';
  currency: string;
  language: string;
  healthCondition: string;
  services: string;
  
  // Step 2: Medical Visit
  firstVisitDate: string;
  secondVisitDays: number | '';
  serviceName: string;
  serviceType: string;
  price: number | '';
  quantity: number | '';
  
  // Step 3: Notes
  notes: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface StepProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (field: keyof FormData, value: string | number) => void;
  onBlur: (field: keyof FormData) => void;
  onValidate: () => boolean;
}