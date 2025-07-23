import React from 'react';
import { StepProps } from '../../types/form';
import FormInput from '../FormInput';

const Step3: React.FC<StepProps> = ({ formData, errors, onChange, onBlur }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Additional Notes</h2>
        <p className="text-gray-600">Please add any additional notes or comments</p>
      </div>

      <FormInput
        label="General Notes"
        type="textarea"
        value={formData.notes}
        onChange={(value) => onChange('notes', value)}
        onBlur={() => onBlur('notes')}
        error={errors.notes}
        placeholder="Enter any additional notes, comments, or special instructions..."
      />
    </div>
  );
};

export default Step3;