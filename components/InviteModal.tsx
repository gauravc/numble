import { useState } from 'react';
import Modal from './Modal';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onInviteSent: () => void;
}

export default function InviteModal({
  isOpen,
  onClose,
  sessionId,
  onInviteSent,
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  const inviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}?session=${sessionId}`
    : '';

  const inviteMessage = `Join me for a Numble challenge! ${inviteLink}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSendSMS = () => {
    // Use sms: URI scheme to open SMS app with pre-filled message
    // On iOS, this will open Messages app
    // On Android, this will open the default SMS app
    const smsLink = `sms:?&body=${encodeURIComponent(inviteMessage)}`;
    window.location.href = smsLink;
    onInviteSent();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite a Friend">
      <div className="space-y-4">
        <p className="text-text-light dark:text-text-dark">
          Send this link to your friend to start playing together!
        </p>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg break-all text-sm">
          {inviteLink}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleSendSMS}
            className="w-full p-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
          >
            📱 Send via Text Message
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full p-4 bg-secondary hover:bg-secondary-dark text-white rounded-lg font-semibold transition-colors"
          >
            {copied ? '✓ Link Copied!' : '📋 Copy Link'}
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          No phone numbers are stored. You&apos;ll make the first guess once they join.
        </p>
      </div>
    </Modal>
  );
}
