import React from "react";

interface AgreementCheckboxProps {
  status: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

function AgreementCheckbox({ status, onStatusChange }: AgreementCheckboxProps) {
  return (
    <div className="my-6 mx-6">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="agreement"
          checked={status}
          onChange={() => onStatusChange(!status)}
          className="w-5 h-5 text-blue-500 focus:ring focus:ring-blue-300 rounded"
        />
        <label htmlFor="agreement" className="text-gray-700 text-sm leading-relaxed">
          I have reviewed the payment information and agree to proceed with the selected action.
        </label>
      </div>
    </div>
  );
}

export default AgreementCheckbox;
