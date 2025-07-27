import React from 'react';
import { StepProps } from '../../types/form';
import FormInput from '../FormInput';
import { Upload, X, Image } from 'lucide-react';

const Step3: React.FC<StepProps> = ({ formData, errors, onChange, onBlur }) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        onChange('uploadedImage', file);
      } else {
        alert('Please select a valid image file (JPG, JPEG, or PNG)');
        event.target.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onChange('uploadedImage', null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Additional Information</h2>
        <p className="text-gray-600">Upload an image and add any additional notes or comments</p>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          Upload Image
        </label>
        
        {!formData.uploadedImage ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">Click to upload image</p>
                <p className="text-sm text-gray-500">JPG, JPEG, or PNG files only</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">{formData.uploadedImage.name}</p>
                  <p className="text-sm text-gray-500">
                    {(formData.uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <X size={16} />
                Remove
              </button>
            </div>
            
            {/* Image Preview */}
            <div className="mt-4">
              <img
                src={URL.createObjectURL(formData.uploadedImage)}
                alt="Preview"
                className="max-w-full h-48 object-contain rounded-lg border border-gray-200"
              />
            </div>
          </div>
        )}
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