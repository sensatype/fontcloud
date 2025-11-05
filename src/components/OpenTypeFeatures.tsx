import React from 'react';
import { useFontStore } from '../store/fontStore';

export const OpenTypeFeatures: React.FC = () => {
  const { features } = useFontStore();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">OpenType Features</h2>
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.tag}
            className="border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{feature.name}</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={feature.enabled}
                  onChange={() => {
                    // TODO: Implement feature toggle
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};