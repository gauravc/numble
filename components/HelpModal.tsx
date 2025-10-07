'use client';

import Modal from './Modal';
import Tile from './Tile';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorBlindMode?: boolean;
}

export default function HelpModal({ isOpen, onClose, colorBlindMode = false }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
      <div className="space-y-4">
        <p>Guess the hidden equation in 6 tries.</p>

        <div className="space-y-2">
          <p className="font-semibold">Rules:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Each guess must be a valid equation</li>
            <li>Format: NUM OP NUM = RESULT</li>
            <li>Valid operators: + - × ÷</li>
            <li>Numbers: 0-99, Results: 0-999</li>
            <li>Division must result in whole numbers</li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-semibold">Examples:</p>

          <div className="space-y-2">
            <p className="text-sm">Target: 12 + 34 = 46</p>
            <p className="text-sm">Guess: 23 + 11 = 34</p>

            <div className="flex gap-1 flex-wrap">
              <Tile char="2" feedback="yellow" colorBlindMode={colorBlindMode} />
              <Tile char="3" feedback="yellow" colorBlindMode={colorBlindMode} />
              <Tile char="" feedback="default" colorBlindMode={colorBlindMode} />
              <Tile char="+" feedback="green" colorBlindMode={colorBlindMode} />
              <Tile char="" feedback="default" colorBlindMode={colorBlindMode} />
              <Tile char="1" feedback="yellow" colorBlindMode={colorBlindMode} />
              <Tile char="1" feedback="gray" colorBlindMode={colorBlindMode} />
              <Tile char="" feedback="default" colorBlindMode={colorBlindMode} />
              <Tile char="=" feedback="green" colorBlindMode={colorBlindMode} />
              <Tile char="" feedback="default" colorBlindMode={colorBlindMode} />
              <Tile char="3" feedback="yellow" colorBlindMode={colorBlindMode} />
              <Tile char="4" feedback="yellow" colorBlindMode={colorBlindMode} />
            </div>

            <ul className="text-xs space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <span className={`inline-block w-4 h-4 rounded ${colorBlindMode ? 'bg-tile-green-cb' : 'bg-tile-green'}`}></span>
                <span>{colorBlindMode ? 'Orange' : 'Navy blue'} = Correct character, correct position</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={`inline-block w-4 h-4 rounded ${colorBlindMode ? 'bg-tile-yellow-cb' : 'bg-tile-yellow'}`}></span>
                <span>{colorBlindMode ? 'Blue' : 'Sky blue'} = Character exists, wrong position</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded bg-tile-gray-light"></span>
                <span>Dark grey = Character not in equation</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-sm italic">A new puzzle is released daily at midnight!</p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-primary text-text-dark font-semibold rounded hover:opacity-90 transition-opacity"
        >
          Got it!
        </button>
      </div>
    </Modal>
  );
}
