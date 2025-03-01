import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const KYCReminderModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    navigate("/profile#kyc-section"); // Navigate and scroll to the KYC section
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-gray-600">
          Please complete your KYC details to access all features.
        </p>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md font-medium"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium"
            onClick={handleCompleteProfile}
          >
            Complete Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default KYCReminderModal;
