import React from 'react';
import { Copy, X } from 'lucide-react';

interface SelectionToolbarProps {
  selectedCount: number;
  onCopy: () => void;
  onClear: () => void;
  onSelectAll: () => void;
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedCount,
  onCopy,
  onClear,
  onSelectAll,
}) => {
  if (selectedCount === 0) {
    return (
      <button
        onClick={onSelectAll}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Select All
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {selectedCount} selected
      </span>
      <button
        onClick={onCopy}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        <Copy className="w-4 h-4" />
        Copy
      </button>
      <button
        onClick={onClear}
        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        title="Clear selection"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};