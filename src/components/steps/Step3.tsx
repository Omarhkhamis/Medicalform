import React from "react";
import { StepProps } from "../../types/form";
import FormInput from "../FormInput";
import { Upload, X, Image } from "lucide-react";

const MAX_IMAGES = 4;

/** تعريفات لأنواع هذه الخطوة */
type Step3FormData = {
  uploadedImages?: File[];
  medicalTreatmentPlan?: string;
  medicalNotes?: string;
  // لو عندك حقول إضافية عامة بالـ formData احتفظنا بإمكانية وجودها:
  [key: string]: unknown;
};

type Step3Errors = {
  medicalTreatmentPlan?: string;
  medicalNotes?: string;
  [key: string]: string | undefined;
};

/** نشتق Props خاصة بهذه الخطوة من StepProps مع ضبط الأنواع */
type Step3Props = Omit<
  StepProps,
  "formData" | "errors" | "onChange" | "onBlur"
> & {
  formData: Step3FormData;
  errors: Step3Errors;
  onChange: <K extends keyof Step3FormData>(
    field: K,
    value: Step3FormData[K]
  ) => void;
  onBlur: (field: keyof Step3FormData) => void;
};

const Step3: React.FC<Step3Props> = ({
  formData,
  errors,
  onChange,
  onBlur,
}) => {
  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const validFiles: File[] = [];

    const current = formData.uploadedImages ?? [];
    const remainingSlots = Math.max(0, MAX_IMAGES - current.length);

    if (remainingSlots === 0) {
      alert(`You can upload up to ${MAX_IMAGES} images only.`);
      event.target.value = "";
      return;
    }

    for (
      let i = 0;
      i < files.length && validFiles.length < remainingSlots;
      i++
    ) {
      const file = files[i];
      if (allowedTypes.includes(file.type)) validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange("uploadedImages", [...current, ...validFiles]);
    }

    const skippedByType = Array.from(files).filter(
      (f) => !allowedTypes.includes(f.type)
    ).length;
    const skippedByLimit = Math.max(
      0,
      files.length - validFiles.length - skippedByType
    );

    if (skippedByType > 0) {
      alert(
        "Some files were skipped. Please select only JPG, JPEG, or PNG files."
      );
    }
    if (skippedByLimit > 0) {
      alert(
        `Only ${remainingSlots} more image(s) allowed (max ${MAX_IMAGES}).`
      );
    }

    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = (formData.uploadedImages ?? []).filter(
      (_, i) => i !== index
    );
    onChange("uploadedImages", updatedImages);
  };

  const uploadedCount = formData.uploadedImages?.length ?? 0;
  const remaining = Math.max(0, MAX_IMAGES - uploadedCount);
  const uploadDisabled = uploadedCount >= MAX_IMAGES;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Additional Information
        </h2>
        <p className="text-gray-600">
          Upload images and add any additional notes or comments
        </p>
      </div>

      {/* Multiple Images Upload Section */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <label className="block text-sm font-semibold text-gray-700">
            Upload Images
          </label>
          <span className="text-xs text-gray-500">
            {uploadedCount}/{MAX_IMAGES} uploaded
            {remaining > 0 ? ` · ${remaining} remaining` : " · limit reached"}
          </span>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            uploadDisabled
              ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-75"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImagesUpload}
            multiple
            className="hidden"
            id="images-upload"
            disabled={uploadDisabled}
          />
          <label
            htmlFor="images-upload"
            className={`flex flex-col items-center gap-4 ${
              uploadDisabled ? "pointer-events-none" : "cursor-pointer"
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                {uploadDisabled
                  ? "Upload limit reached"
                  : "Click to upload images"}
              </p>
              <p className="text-sm text-gray-500">
                JPG, JPEG, or PNG files only (max {MAX_IMAGES})
              </p>
            </div>
          </label>
        </div>

        {/* Images Preview */}
        {uploadedCount > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800">
              Uploaded Images ({uploadedCount}/{MAX_IMAGES})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(formData.uploadedImages ?? []).map((image, index) => (
                <div
                  key={index}
                  className="relative bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                    title="Remove image"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X size={16} />
                  </button>

                  <div className="flex items-center gap-2 pr-10">
                    <Image className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">
                        {image.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="mt-1">
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
      {/* Medical treatment plan */}
      <FormInput
        label="Medical treatment plan"
        type="textarea"
        value={formData.medicalTreatmentPlan ?? ""}
        onChange={(value: string | number) =>
          onChange("medicalTreatmentPlan", String(value))
        }
        onBlur={() => onBlur("medicalTreatmentPlan")}
        error={errors.medicalTreatmentPlan}
        placeholder="Enter the medical treatment plan details..."
      />

      {/* Medical notes */}
      <FormInput
        label="Medical notes"
        type="textarea"
        value={formData.medicalNotes ?? ""}
        onChange={(value: string | number) =>
          onChange("medicalNotes", String(value))
        }
        onBlur={() => onBlur("medicalNotes")}
        error={errors.medicalNotes}
        placeholder="Enter medical notes and observations..."
      />
    </div>
  );
};

export default Step3;
