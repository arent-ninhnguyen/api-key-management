'use client';

export default function Toast({ show, message, type, onClose }) {
  if (!show) return null;

  const getToastBgColor = () => {
    switch (type) {
      case 'delete':
        return 'bg-red-600';
      case 'error':
        return 'bg-red-600';
      case 'success':
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className={`fixed top-4 right-4 flex items-center ${getToastBgColor()} text-white px-4 py-3 rounded-md shadow-md z-50`}>
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <p>{message}</p>
      <button 
        onClick={onClose}
        className="ml-4 text-white"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
} 