import Modal from './Modal';

interface GameModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSolo: () => void;
  onSelectMultiplayer: () => void;
}

export default function GameModeModal({
  isOpen,
  onClose,
  onSelectSolo,
  onSelectMultiplayer,
}: GameModeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Game Mode">
      <div className="space-y-4">
        <button
          onClick={onSelectSolo}
          className="w-full p-6 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-lg transition-colors"
        >
          <div className="text-2xl mb-2">🎯</div>
          <div>Play Solo</div>
          <div className="text-sm font-normal mt-1 opacity-90">
            Solve today&apos;s equation on your own
          </div>
        </button>

        <button
          onClick={onSelectMultiplayer}
          className="w-full p-6 bg-secondary hover:bg-secondary-dark text-white rounded-lg font-semibold text-lg transition-colors"
        >
          <div className="text-2xl mb-2">👥</div>
          <div>Play with Friend</div>
          <div className="text-sm font-normal mt-1 opacity-90">
            Invite a friend via text message
          </div>
        </button>
      </div>
    </Modal>
  );
}
