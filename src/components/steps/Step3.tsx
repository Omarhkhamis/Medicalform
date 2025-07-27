import React from 'react';
import { StepProps } from '../../types/form';
import FormInput from '../FormInput';
import { Upload, X, Image, Link } from 'lucide-react';

const Step3: React.FC<StepProps> = ({ formData, errors, onChange, onBlur }) => {
  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const validFiles: File[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (allowedTypes.includes(file.type)) {
          validFiles.push(file);
        }
      }
      
      if (validFiles.length > 0) {
        onChange('uploadedImages', [...formData.uploadedImages, ...validFiles]);
      }
      
      if (validFiles.length !== files.length) {
        alert('Some files were skipped. Please select only JPG, JPEG, or PNG files.');
      }
      
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.uploadedImages.filter((_, i) => i !== index);
    onChange('uploadedImages', updatedImages);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Additional Information</h2>
        <p className="text-gray-600">Upload images and add any additional notes or comments</p>
      </div>

      {/* External Link Section */}
      <div className="space-y-4">
        <FormInput
          label="External Link"
          type="url"
          value={formData.externalLink}
          onChange={(value) => onChange('externalLink', value)}
          onBlur={() => onBlur('externalLink')}
          error={errors.externalLink}
          placeholder="https://example.com"
        />
      </div>

      {/* Multiple Images Upload Section */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          Upload Images
        </label>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImagesUpload}
            multiple
            className="hidden"
            id="images-upload"
          />
          <label
            htmlFor="images-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">Click to upload images</p>
              <p className="text-sm text-gray-500">JPG, JPEG, or PNG files only (multiple selection allowed)</p>
            </div>
          </label>
        </div>
        
        {/* Images Preview */}
        {formData.uploadedImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800">Uploaded Images ({formData.uploadedImages.length})</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.uploadedImages.map((image, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image className="w-5 h-5 text-blue-500" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 truncate">{image.name}</p>
                        <p className="text-sm text-gray-500">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {/* Image Preview */}
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
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