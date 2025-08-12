import React, { useMemo, useState } from "react";
import { StepProps, ServiceEntry } from "../../types/form";
import FormInput from "../FormInput";
import { Plus, X } from "lucide-react";

const Step2: React.FC<StepProps> = ({ formData, errors, onChange }) => {
  const [firstVisitEntry, setFirstVisitEntry] = useState({
    serviceName: "",
    serviceType: "",
    price: "" as number | "",
    quantity: "" as number | "",
  });

  const [secondVisitEntry, setSecondVisitEntry] = useState({
    serviceName: "",
    serviceType: "",
    price: "" as number | "",
    quantity: "" as number | "",
  });

  // فعّل الزيارة الثانية تلقائياً إذا فيها بيانات مسبقاً
  const initiallyEnabled = useMemo(() => {
    const v = formData.secondVisit;
    return Boolean(
      v?.visitDate ||
        v?.visitDays ||
        (v?.serviceEntries && v.serviceEntries.length > 0)
    );
  }, [formData.secondVisit]);

  const [secondVisitEnabled, setSecondVisitEnabled] =
    useState<boolean>(initiallyEnabled);

  const serviceNameOptions = [
    { value: "dental_implant", label: "Dental Implant" },
    { value: "zirconium_crown", label: "Zirconium Crown" },
    { value: "open_sinus_lift", label: "Open Sinus Lift" },
    { value: "close_sinus_lift", label: "Close Sinus Lift" },
    { value: "veneer_lens", label: "Veneer Lens" },
  ];

  const handleFirstVisitChange = (field: string, value: string | number) => {
    const updatedFirstVisit = { ...formData.firstVisit } as any;
    if (field === "visitDate") updatedFirstVisit.visitDate = value as string;
    if (field === "visitDays") updatedFirstVisit.visitDays = value as number;
    onChange("firstVisit", updatedFirstVisit);
  };

  const handleSecondVisitChange = (field: string, value: string | number) => {
    const updatedSecondVisit = { ...formData.secondVisit } as any;
    if (field === "visitDate") updatedSecondVisit.visitDate = value as string;
    if (field === "visitDays") updatedSecondVisit.visitDays = value as number;
    onChange("secondVisit", updatedSecondVisit);
  };

  const handleFirstVisitEntryChange = (
    field: string,
    value: string | number
  ) => {
    setFirstVisitEntry((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecondVisitEntryChange = (
    field: string,
    value: string | number
  ) => {
    setSecondVisitEntry((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFirstVisitEntry = () => {
    const hasData =
      firstVisitEntry.serviceName ||
      firstVisitEntry.serviceType ||
      firstVisitEntry.price !== "" ||
      firstVisitEntry.quantity !== "";

    if (hasData) {
      const newEntry: ServiceEntry = {
        id: Date.now().toString(),
        ...firstVisitEntry,
      };

      const updatedFirstVisit = {
        ...formData.firstVisit,
        serviceEntries: [...formData.firstVisit.serviceEntries, newEntry],
      };
      onChange("firstVisit", updatedFirstVisit as any);

      setFirstVisitEntry({
        serviceName: "",
        serviceType: "",
        price: "",
        quantity: "",
      });
    }
  };

  const handleAddSecondVisitEntry = () => {
    const hasData =
      secondVisitEntry.serviceName ||
      secondVisitEntry.serviceType ||
      secondVisitEntry.price !== "" ||
      secondVisitEntry.quantity !== "";

    if (hasData) {
      const newEntry: ServiceEntry = {
        id: Date.now().toString(),
        ...secondVisitEntry,
      };

      const updatedSecondVisit = {
        ...formData.secondVisit,
        serviceEntries: [...formData.secondVisit.serviceEntries, newEntry],
      };
      onChange("secondVisit", updatedSecondVisit as any);

      setSecondVisitEntry({
        serviceName: "",
        serviceType: "",
        price: "",
        quantity: "",
      });
    }
  };

  const handleRemoveFirstVisitEntry = (id: string) => {
    const updatedFirstVisit = {
      ...formData.firstVisit,
      serviceEntries: formData.firstVisit.serviceEntries.filter(
        (entry) => entry.id !== id
      ),
    };
    onChange("firstVisit", updatedFirstVisit as any);
  };

  const handleRemoveSecondVisitEntry = (id: string) => {
    const updatedSecondVisit = {
      ...formData.secondVisit,
      serviceEntries: formData.secondVisit.serviceEntries.filter(
        (entry) => entry.id !== id
      ),
    };
    onChange("secondVisit", updatedSecondVisit as any);
  };

  const formatPrice = (price: number | "", currency: string) => {
    if (price === "" || price === 0) return "-";
    return `${price} ${currency}`;
  };

  const renderVisitSection = (
    title: string,
    visitData: {
      visitDate: string;
      visitDays: number | "";
      serviceEntries: ServiceEntry[];
    },
    currentEntry: {
      serviceName: string;
      serviceType: string;
      price: number | "";
      quantity: number | "";
    },
    onVisitChange: (field: string, value: string | number) => void,
    onEntryChange: (field: string, value: string | number) => void,
    onAddEntry: () => void,
    onRemoveEntry: (id: string) => void,
    visitDateError?: string,
    visitDaysError?: string,
    isRequired: boolean = true
  ) => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
        {title}
      </h3>

      {/* Visit Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Visit Date"
          type="date"
          value={visitData.visitDate}
          onChange={(value) => onVisitChange("visitDate", value)}
          error={visitDateError}
          required={isRequired}
        />

        <FormInput
          label="Visit Days"
          type="number"
          value={visitData.visitDays}
          onChange={(value) => onVisitChange("visitDays", value)}
          error={visitDaysError}
          required={isRequired}
          placeholder="Days until visit"
        />
      </div>

      {/* Service Entry Form */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <h4 className="text-lg font-medium text-gray-800">Add Service Entry</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Service Name"
            type="select"
            value={currentEntry.serviceName}
            onChange={(value) => onEntryChange("serviceName", value)}
            options={serviceNameOptions}
            placeholder="Select service"
          />

          <FormInput
            label="Service Type"
            value={currentEntry.serviceType}
            onChange={(value) => onEntryChange("serviceType", value)}
            placeholder="Enter service type"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Price"
            type="number"
            value={currentEntry.price}
            onChange={(value) => onEntryChange("price", value)}
            placeholder="Enter price"
          />

          <FormInput
            label="Quantity"
            type="number"
            value={currentEntry.quantity}
            onChange={(value) => onEntryChange("quantity", value)}
            placeholder="Enter quantity"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onAddEntry}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 hover:shadow-lg hover:shadow-blue-200"
          >
            <Plus size={20} />
            Add Entry
          </button>
        </div>
      </div>

      {/* Service Entries List */}
      {visitData.serviceEntries.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-800">Service Entries</h4>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-3">Service Name</div>
                <div className="col-span-3">Service Type</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2 text-center">Action</div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {visitData.serviceEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center text-sm">
                    <div className="col-span-3 text-gray-900">
                      {entry.serviceName || "-"}
                    </div>
                    <div className="col-span-3 text-gray-900">
                      {entry.serviceType || "-"}
                    </div>
                    <div className="col-span-2 text-gray-900">
                      {formatPrice(entry.price, formData.currency)}
                    </div>
                    <div className="col-span-2 text-gray-900">
                      {entry.quantity || "-"}
                    </div>
                    <div className="col-span-2 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveEntry(entry.id)}
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
            Total entries: {visitData.serviceEntries.length}
          </div>
        </div>
      )}
    </div>
  );

  // عند تفعيل/إلغاء تفعيل الزيارة الثانية
  const toggleSecondVisit = (enabled: boolean) => {
    setSecondVisitEnabled(enabled);
    if (!enabled) {
      // مسح بيانات الزيارة الثانية بالكامل
      onChange("secondVisit", {
        visitDate: "",
        visitDays: "",
        serviceEntries: [],
      } as any);
      // إعادة ضبط نموذج الإدخال المؤقت
      setSecondVisitEntry({
        serviceName: "",
        serviceType: "",
        price: "",
        quantity: "",
      });
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Medical Visits
        </h2>
        <p className="text-gray-600">
          Please provide medical visit details and service information
        </p>
      </div>

      {/* First Visit Section (Required) */}
      {renderVisitSection(
        "First Visit",
        formData.firstVisit,
        firstVisitEntry,
        handleFirstVisitChange,
        handleFirstVisitEntryChange,
        handleAddFirstVisitEntry,
        handleRemoveFirstVisitEntry,
        errors.firstVisitDate,
        errors.firstVisitDays,
        true // required
      )}

      {/* Toggle for Second Visit */}
      <div className="flex items-center gap-3">
        <input
          id="enable-second-visit"
          type="checkbox"
          checked={secondVisitEnabled}
          onChange={(e) => toggleSecondVisit(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="enable-second-visit"
          className="text-sm font-medium text-gray-700 select-none"
        >
          Enable Second Visit (optional)
        </label>
      </div>

      {/* Second Visit Section (Optional) */}
      {secondVisitEnabled &&
        renderVisitSection(
          "Second Visit",
          formData.secondVisit,
          secondVisitEntry,
          handleSecondVisitChange,
          handleSecondVisitEntryChange,
          handleAddSecondVisitEntry,
          handleRemoveSecondVisitEntry,
          errors.secondVisitDate,
          errors.secondVisitDays,
          false // NOT required
        )}
    </div>
  );
};

export default Step2;
