import React from "react";
import { FaCheckCircle, FaClipboardCheck, FaClock, FaShippingFast } from "react-icons/fa";

interface FlowStep {
    label: string;
    icon?: React.ReactNode;
}

const steps: FlowStep[] = [
    { label: "Awaiting Payment", icon: <FaClock /> },
    { label: "Verify Payment", icon: <FaClipboardCheck /> },
    { label: "Pre-Shipping Check", icon: <FaShippingFast /> },
    { label: "Order Complete", icon: <FaCheckCircle /> },
];

interface OrderFlowProps {
    currentStep: number;
}

export default function OrderFlow({ currentStep }: OrderFlowProps) {
    return (
        <div className="flex items-center w-full max-w-4xl mx-auto px-6 py-8">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                                index < currentStep
                                    ? "bg-blue-200 border-blue-400 text-blue-800"
                                    : index === currentStep
                                    ? "bg-blue-500 border-blue-500 text-white"
                                    : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                        >
                            {step.icon}
                        </div>
                        <p
                            className={`mt-2 text-sm font-medium transition-all duration-300 ${
                                index <= currentStep ? "text-black" : "text-gray-400"
                            }`}
                        >
                            {step.label}
                        </p>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                        <div className="flex-1 flex items-center">
                            <div
                                className={`mt-[-22px] h-1 w-full bg-transparent border-t-2 border-dashed ${
                                    index < currentStep
                                        ? "border-blue-400"
                                        : "border-gray-300"
                                }`}
                            ></div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
