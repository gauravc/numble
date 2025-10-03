'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark
                   rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
