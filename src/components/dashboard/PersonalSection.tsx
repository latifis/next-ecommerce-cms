import { Gender } from "@/enum/gender";
import { Language } from "@/enum/language";
import { FaSpinner } from "react-icons/fa";
import { SectionDivider } from "../ui/SectionDivider";

type PersonalSectionProps = {
    userEmail?: string;
    formData: {
        name: string;
        phone: string;
        address: string;
        birthDate: string;
        gender: Gender;
        languagePreference: Language;
    };
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (event: React.FormEvent) => void;
    isPendingUpdateUser?: boolean;
    isFormChanged?: boolean;
};

export default function PersonalSection({
    userEmail,
    formData,
    handleChange,
    handleSubmit,
    isPendingUpdateUser = false,
    isFormChanged = false,
}: PersonalSectionProps) {
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full space-y-8 mt-[-8px]"
        >
            <div className="overflow-y-auto max-h-[calc(100vh-400px)]">

                <div className="px-4">
                    <SectionDivider label="General Settings" />

                    <div className="space-y-2 my-6">
                        <label className="block text-sm font-bold text-blue-700">Language Preference</label>
                        <select
                            name="languagePreference"
                            value={formData.languagePreference}
                            onChange={handleChange}
                            className="w-full h-[44px] rounded-lg border border-blue-200 px-4 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value={Language.ID}>Bahasa Indonesia</option>
                            <option value={Language.EN}>English</option>
                            <option value={Language.JP}>日本語</option>
                            <option value={Language.AR}>العربية</option>
                        </select>
                    </div>

                    <SectionDivider label="Personal Details" />

                    <div className="space-y-6 mt-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-blue-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full rounded-lg border border-blue-200 px-4 py-2 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-blue-700">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={userEmail || ""}
                                onChange={handleChange}
                                disabled
                                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500 placeholder:text-gray-400 cursor-not-allowed"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-blue-700">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+62..."
                                className="w-full rounded-lg border border-blue-200 px-4 py-2 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-blue-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                className="w-full rounded-lg border border-blue-200 px-4 py-2 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        {/* Birth Date */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-blue-700">Birth Date</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-blue-200 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-blue-700">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full h-[44px] rounded-lg border border-blue-200 px-4 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value={Gender.MALE}>Male</option>
                                <option value={Gender.FEMALE}>Female</option>
                                <option value={Gender.OTHER}>Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={!isFormChanged || isPendingUpdateUser}
                    className={`px-6 py-2 rounded-lg font-semibold shadow transition duration-150 focus:ring-2 focus:outline-none ${isFormChanged && !isPendingUpdateUser
                        ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isPendingUpdateUser ? (
                        <div className="flex items-center gap-2">
                            <FaSpinner className="animate-spin text-gray-500" />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </div>
        </form>
    );
}