import React from "react";
import { StepProps } from "../../types/form";
import FormInput from "../FormInput";
import PhoneInput from "../PhoneInput";

const Step1: React.FC<StepProps> = ({ formData, errors, onChange, onBlur }) => {
  const currencyOptions = [
    { value: "EUR", label: "Euro (€)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
  ];

  const languageOptions = [
    { value: "arabic", label: "Arabic" },
    { value: "english", label: "English" },
    { value: "french", label: "French" },
    { value: "spanish", label: "Spanish" },
    { value: "turkish", label: "Turkish" },
    { value: "russian", label: "Russian" },
    { value: "other", label: "Other" },
  ];

  const healthConditionOptions = [
    { value: "good", label: "Good" },
    { value: "requires_report", label: "Requires medical report" },
  ];

  const servicesOptions = [
    { value: "dental", label: "Dental" },
    { value: "hollywood_smile", label: "Hollywood Smile" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">
          Please provide your personal and contact details
        </p>
      </div>

      {/* Row 1: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormInput
          label="Consultant Name"
          value={formData.consultantName}
          onChange={(value) => onChange("consultantName", value)}
          onBlur={() => onBlur("consultantName")}
          error={errors.consultantName}
          required
          placeholder="Enter consultant name"
        />

        <FormInput
          label="Patient Name"
          value={formData.patientName}
          onChange={(value) => onChange("patientName", value)}
          onBlur={() => onBlur("patientName")}
          error={errors.patientName}
          required
          placeholder="Enter patient name"
        />

        <PhoneInput
          value={formData.phoneNumber}
          onChange={(phone) => onChange("phoneNumber", phone)}
          onBlur={() => onBlur("phoneNumber")}
          error={errors.phoneNumber}
        />
      </div>

      {/* Row 2: 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FormInput
          label="Patient ID"
          value={formData.patientId}
          onChange={(value) => onChange("patientId", value)}
          onBlur={() => onBlur("patientId")}
          error={errors.patientId}
          required
          placeholder="Enter patient ID"
        />

        <FormInput
          label="Entry Date"
          type="date"
          value={formData.entryDate}
          onChange={(value) => onChange("entryDate", value)}
          onBlur={() => onBlur("entryDate")}
          error={errors.entryDate}
          required
        />

        <FormInput
          label="Age"
          type="number"
          value={formData.age}
          onChange={(value) => onChange("age", value)}
          onBlur={() => onBlur("age")}
          error={errors.age}
          required
          placeholder="Enter age"
        />

        <FormInput
          label="Currency"
          type="select"
          value={formData.currency}
          onChange={(value) => onChange("currency", value)}
          onBlur={() => onBlur("currency")}
          options={currencyOptions}
          error={errors.currency}
          required
        />
      </div>

      {/* Row 3: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormInput
          label="Language"
          type="select"
          value={formData.language}
          onChange={(value) => onChange("language", value)}
          onBlur={() => onBlur("language")}
          options={languageOptions}
          error={errors.language}
          required
        />

        <FormInput
          label="Health Condition"
          type="select"
          value={formData.healthCondition}
          onChange={(value) => onChange("healthCondition", value)}
          onBlur={() => onBlur("healthCondition")}
          options={healthConditionOptions}
          error={errors.healthCondition}
          required
        />

        <FormInput
          label="Services"
          type="select"
          value={formData.services}
          onChange={(value) => onChange("services", value)}
          onBlur={() => onBlur("services")}
          options={servicesOptions}
          error={errors.services}
          required
        />
      </div>
    </div>
  );
};

export default Step1;
