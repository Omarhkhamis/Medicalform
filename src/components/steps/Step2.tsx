import React, { useState } from 'react';
import { StepProps, ServiceEntry } from '../../types/form';
import FormInput from '../FormInput';
import { Plus, X } from 'lucide-react';

const Step2: React.FC<StepProps> = ({ formData, errors, onChange, onBlur }) => {
  const [currentEntry, setCurrentEntry] = useState({
    serviceName: '',
    serviceType: '',
    price: '' as number | '',
    quantity: '' as number | ''
  });

  const serviceNameOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const handleCurrentEntryChange = (field: string, value: string | number) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEntry = () => {
    // Check if at least one field is filled
    const hasData = currentEntry.serviceName || 
                   currentEntry.serviceType || 
                   currentEntry.price !== '' || 
                   currentEntry.quantity !== '';

    if (hasData) {
      const newEntry: ServiceEntry = {
        id: Date.now().toString(),
        ...currentEntry
      };

      const updatedEntries = [...formData.serviceEntries, newEntry];
      onChange('serviceEntries', updatedEntries as any);

      // Clear the form
      setCurrentEntry({
        serviceName: '',
        serviceType: '',
        price: '',
        quantity: ''
      });
    }
  };

  const handleRemoveEntry = (id: string) => {
    const updatedEntries = formData.serviceEntries.filter(entry => entry.id !== id);
    onChange('serviceEntries', updatedEntries as any);
  };

  const formatPrice = (price: number | '', currency: string) => {
    if (price === '' || price === 0) return '-';
    return `${price} ${currency}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Medical Visit</h2>
        <p className="text-gray-600">Please provide medical visit details and service information</p>
      </div>

      {/* Row 1: Visit dates */}
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

      {/* Service Entry Form */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Add Service Entry</h3>
        
        {/* Row 2: Service details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Service Name"
            type="select"
            value={currentEntry.serviceName}
            onChange={(value) => handleCurrentEntryChange('serviceName', value)}
            options={serviceNameOptions}
            placeholder="Select service"
          />

          <FormInput
            label="Service Type"
            value={currentEntry.serviceType}
            onChange={(value) => handleCurrentEntryChange('serviceType', value)}
            placeholder="Enter service type"
          />
        </div>

        {/* Row 3: Price and quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Price"
            type="number"
            value={currentEntry.price}
            onChange={(value) => handleCurrentEntryChange('price', value)}
            placeholder="Enter price"
          />

          <FormInput
            label="Quantity"
            type="number"
            value={currentEntry.quantity}
            onChange={(value) => handleCurrentEntryChange('quantity', value)}
            placeholder="Enter quantity"
          />
        </div>

        {/* Add button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddEntry}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 hover:shadow-lg hover:shadow-blue-200"
          >
            <Plus size={20} />
            Add Entry
          </button>
        </div>
      </div>

      {/* Service Entries List */}
      {formData.serviceEntries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Service Entries</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-3">Service Name</div>
                <div className="col-span-3">Service Type</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2 text-center">Action</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {formData.serviceEntries.map((entry, index) => (
                <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center text-sm">
                    <div className="col-span-3 text-gray-900">
                      {entry.serviceName || '-'}
                    </div>
                    <div className="col-span-3 text-gray-900">
                      {entry.serviceType || '-'}
                    </div>
                    <div className="col-span-2 text-gray-900">
                      {formatPrice(entry.price, formData.currency)}
                    </div>
                    <div className="col-span-2 text-gray-900">
                      {entry.quantity || '-'}
                    </div>
                    <div className="col-span-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveEntry(entry.id)}
                        className="inline-flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                        title="Remove entry"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Total entries: {formData.serviceEntries.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2;