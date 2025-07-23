import React from 'react';
import { StepProps } from '../../types/form';
import FormInput from '../FormInput';

const Step2: React.FC<StepProps> = ({ formData, errors, onChange, onBlur }) => {
  const serviceNameOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Medical Visit</h2>
        <p className="text-gray-600">Please provide medical visit details and service information</p>
      </div>

      {/* Row 1: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="First Visit Date"
          type="date"
          value={formData.firstVisitDate}
          onChange={(value) => onChange('firstVisitDate', value)}
          onBlur={() => onBlur('firstVisitDate')}
          error={errors.firstVisitDate}
          required
        />

        <FormInput
          label="Second Visit Days"
          type="number"
          value={formData.secondVisitDays}
          onChange={(value) => onChange('secondVisitDays', value)}
          onBlur={() => onBlur('secondVisitDays')}
          error={errors.secondVisitDays}
          required
          placeholder="Days until second visit"
        />
      </div>

      {/* Row 2: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Service Name"
          type="select"
          value={formData.serviceName}
          onChange={(value) => onChange('serviceName', value)}
          onBlur={() => onBlur('serviceName')}
          options={serviceNameOptions}
          error={errors.serviceName}
          required
        />

        <FormInput
          label="Service Type"
          value={formData.serviceType}
          onChange={(value) => onChange('serviceType', value)}
          onBlur={() => onBlur('serviceType')}
          error={errors.serviceType}
          required
          placeholder="Enter service type"
        />
      </div>

      {/* Row 3: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Price"
          type="number"
          value={formData.price}
          onChange={(value) => onChange('price', value)}
          onBlur={() => onBlur('price')}
          error={errors.price}
          required
          placeholder="Enter price"
        />

        <FormInput
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(value) => onChange('quantity', value)}
          onBlur={() => onBlur('quantity')}
          error={errors.quantity}
          required
          placeholder="Enter quantity"
        />
      </div>
    </div>
  );
};

export default Step2;