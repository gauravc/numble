'use client';

interface HeaderProps {
  onHelpClick: () => void;
  onStatsClick: () => void;
  onSettingsClick: () => void;
}

export default function Header({ onHelpClick, onStatsClick, onSettingsClick }: HeaderProps) {
  return (
    <header className="w-full border-b border-border-light dark:border-border-dark">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={onHelpClick}
          className="text-2xl hover:opacity-70 transition-opacity"
          aria-label="Help"
        >
          ?
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-text-light dark:text-text-dark">
          NUMBLE
        </h1>

        <div className="flex gap-3">
          <button
            onClick={onStatsClick}
            className="text-2xl hover:opacity-70 transition-opacity"
            aria-label="Statistics"
          >
            📊
          </button>
          <button
            onClick={onSettingsClick}
            className="text-2xl hover:opacity-70 transition-opacity"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
