import { useState } from "react";
import { Calendar, Clock, Users, Phone, User, CheckCircle, AlertCircle } from "lucide-react";

export default function BookTable() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: 1,
    time: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("https://7-eleven-backend.vercel.app/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", phone: "", guests: 1, time: "" });
        setTimeout(() => {
          setIsSuccess(false);
          setMessage("");
        }, 5000);
      } else {
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("Unable to process your reservation. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Reserve Your Table</h2>
            <p className="text-blue-100 text-sm">Book your dining experience</p>
          </div>

          {/* Form Container */}
          <div className="p-6 space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full px-3 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
                placeholder="Enter phone number"
                className="w-full px-3 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Guests and Time Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Guests Field */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 mr-1 text-blue-600" />
                  Guests
                </label>
                <div className="relative">
                  <select
                    value={formData.guests}
                    onChange={(e) => handleChange("guests", parseInt(e.target.value))}
                    required
                    className="w-full px-3 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-gray-800 appearance-none cursor-pointer"
                  >
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Time Field */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 mr-1 text-blue-600" />
                  Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border-2 border-transparent rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-gray-800 text-sm"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">Leave time blank for next available slot</p>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reserve Table
                </div>
              )}
            </button>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg flex items-center transition-all duration-300 ${
                isSuccess 
                  ? "bg-green-50 border border-green-200 text-green-800" 
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
                {isSuccess ? (
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                )}
                <p className="font-medium text-sm">{message}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 text-center">
            <p className="text-xs text-gray-600">
              Need help? Call <span className="font-semibold text-blue-600">(555) 123-4567</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}