'use client';

interface HeaderProps {
  onHelpClick: () => void;
  onStatsClick: () => void;
  onSettingsClick: () => void;
}

export default function Header({ onHelpClick, onStatsClick, onSettingsClick }: HeaderProps) {
  return (
    <header className="w-full border-b border-border-light dark:border-border-dark">
      <div className="max-w-6xl mx-auto px-2 xs:px-4 py-2 xs:py-3 sm:py-4 flex items-center justify-between">
        <button
          onClick={onHelpClick}
          className="text-xl xs:text-2xl hover:opacity-70 transition-opacity w-8 xs:w-10"
          aria-label="Help"
        >
          ?
        </button>

        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-text-light dark:text-text-dark">
          NUMBLE
        </h1>

        <div className="flex gap-2 xs:gap-3">
          <button
            onClick={onStatsClick}
            className="text-xl xs:text-2xl hover:opacity-70 transition-opacity"
            aria-label="Statistics"
          >
            📊
          </button>
          <button
            onClick={onSettingsClick}
            className="text-xl xs:text-2xl hover:opacity-70 transition-opacity"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
