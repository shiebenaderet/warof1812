import React, { useEffect } from 'react';

export default function ConfirmActionModal({ actionType, actionData, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onConfirm, onCancel]);

  if (!actionData) return null;

  const isPlacement = actionType === 'placement';
  const isManeuver = actionType === 'maneuver';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 1000 }} role="presentation">
      <div className="bg-war-navy border border-war-gold/30 rounded-lg max-w-md w-full shadow-modal animate-fadein" role="dialog" aria-modal="true" aria-label={isPlacement ? 'Confirm deployment' : 'Confirm maneuver'}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-war-gold/20" style={{
          background: 'linear-gradient(135deg, rgba(184,115,51,0.2) 0%, rgba(20,30,48,0.95) 100%)',
        }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-war-copper/80" />
            <p className="text-war-copper text-sm tracking-[0.2em] uppercase font-body font-bold">
              {isPlacement ? 'Deployment Order' : 'Maneuver Order'}
            </p>
          </div>
          <h3 className="text-parchment font-display text-lg tracking-wide">
            {isPlacement && 'Confirm Deployment'}
            {isManeuver && 'Confirm Maneuver'}
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-parchment/90 font-body text-base mb-5 leading-relaxed">
            {isPlacement && `Deploy ${actionData.troopCount} ${actionData.troopCount === 1 ? 'troop' : 'troops'} to ${actionData.territoryName}?`}
            {isManeuver && `Move ${actionData.troopCount} ${actionData.troopCount === 1 ? 'troop' : 'troops'} from ${actionData.fromTerritoryName} to ${actionData.territoryName}?`}
          </p>

          {/* Preview box */}
          <div className="bg-black/20 rounded px-5 py-4 border-l-2 border-war-copper/50">
            <p className="text-sm text-war-copper/80 uppercase tracking-wider mb-3 font-body font-bold">Preview</p>

            {isPlacement && (
              <div className="space-y-2 font-body">
                <div className="flex justify-between items-center">
                  <span className="text-parchment-dark/60 text-sm">Current garrison:</span>
                  <span className="text-parchment/80 font-bold">{actionData.currentTroops}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-parchment-dark/60 text-sm">After deployment:</span>
                  <span className="text-war-gold font-bold text-lg font-display">{actionData.newTroops}</span>
                </div>
              </div>
            )}

            {isManeuver && (
              <div className="space-y-3 font-body">
                <div>
                  <p className="text-parchment-dark/50 text-sm uppercase mb-1 font-bold">{actionData.fromTerritoryName}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-parchment-dark/60 text-sm">Current:</span>
                    <span className="text-parchment/80">{actionData.fromCurrentTroops}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-parchment-dark/60 text-sm">After:</span>
                    <span className="text-war-gold font-bold">{actionData.fromNewTroops}</span>
                  </div>
                </div>
                <div className="border-t border-parchment-dark/10 pt-2">
                  <p className="text-parchment-dark/50 text-sm uppercase mb-1 font-bold">{actionData.territoryName}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-parchment-dark/60 text-sm">Current:</span>
                    <span className="text-parchment/80">{actionData.currentTroops}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-parchment-dark/60 text-sm">After:</span>
                    <span className="text-war-gold font-bold">{actionData.newTroops}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="text-parchment-dark/40 text-sm text-center mt-4 font-body italic">
            Press Enter to confirm, Esc to cancel
          </p>
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 font-display text-base rounded border border-parchment-dark/20 text-parchment/70
                       hover:border-war-gold/40 hover:text-parchment transition-colors cursor-pointer tracking-wide"
            style={{ minHeight: '44px' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 font-display text-base rounded bg-war-gold text-war-ink
                       hover:bg-war-brass transition-colors cursor-pointer font-bold tracking-wide shadow-copper"
            style={{ minHeight: '44px' }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
