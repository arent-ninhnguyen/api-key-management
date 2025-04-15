'use client';

export default function DeleteConfirmModal({ 
  show,
  onCancel,
  onConfirm,
  itemName = 'API Key'
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2 text-red-600 dark:text-red-500">
          Delete {itemName}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.
        </p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
            data-cy="confirm-delete-button"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            data-cy="cancel-delete-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 