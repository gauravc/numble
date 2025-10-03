'use client';

import Modal from './Modal';
import { Settings } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsModalProps) {
  const handleThemeToggle = () => {
    onSettingsChange({
      ...settings,
      theme: settings.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const handleHardModeToggle = () => {
    onSettingsChange({
      ...settings,
      hardMode: !settings.hardMode,
    });
  };

  const handleColorBlindModeToggle = () => {
    onSettingsChange({
      ...settings,
      colorBlindMode: !settings.colorBlindMode,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
          <div>
            <div className="font-semibold">Dark Theme</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark mode
            </div>
          </div>
          <button
            onClick={handleThemeToggle}
            className={`
              relative w-14 h-7 rounded-full transition-colors
              ${settings.theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}
            `}
            aria-label="Toggle theme"
          >
            <div
              className={`
                absolute top-1 w-5 h-5 bg-white rounded-full transition-transform
                ${settings.theme === 'dark' ? 'translate-x-8' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {/* Hard Mode Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
          <div>
            <div className="font-semibold">Hard Mode</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Revealed hints must be used in subsequent guesses
            </div>
          </div>
          <button
            onClick={handleHardModeToggle}
            className={`
              relative w-14 h-7 rounded-full transition-colors
              ${settings.hardMode ? 'bg-primary' : 'bg-gray-300'}
            `}
            aria-label="Toggle hard mode"
          >
            <div
              className={`
                absolute top-1 w-5 h-5 bg-white rounded-full transition-transform
                ${settings.hardMode ? 'translate-x-8' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {/* Color Blind Mode Toggle */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="font-semibold">Color Blind Mode</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              High contrast colors
            </div>
          </div>
          <button
            onClick={handleColorBlindModeToggle}
            className={`
              relative w-14 h-7 rounded-full transition-colors
              ${settings.colorBlindMode ? 'bg-primary' : 'bg-gray-300'}
            `}
            aria-label="Toggle color blind mode"
          >
            <div
              className={`
                absolute top-1 w-5 h-5 bg-white rounded-full transition-transform
                ${settings.colorBlindMode ? 'translate-x-8' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
}
