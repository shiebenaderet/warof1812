import React, { useEffect } from 'react';

/**
 * ConfirmActionModal - War-themed confirmation dialog for troop placement and maneuvers
 *
 * @param {Object} props
 * @param {string} props.actionType - Type of action: 'placement' | 'maneuver'
 * @param {Object} props.actionData - Data about the action to confirm
 * @param {string} props.actionData.territoryId - Territory ID for the action
 * @param {string} props.actionData.territoryName - Human-readable territory name
 * @param {number} props.actionData.troopCount - Number of troops being placed/moved
 * @param {number} props.actionData.currentTroops - Current troop count in territory
 * @param {number} props.actionData.newTroops - New troop count after action
 * @param {string} props.actionData.fromTerritoryName - (Maneuver only) Source territory name
 * @param {number} props.actionData.fromCurrentTroops - (Maneuver only) Source current troops
 * @param {number} props.actionData.fromNewTroops - (Maneuver only) Source new troops
 * @param {Function} props.onConfirm - Callback when user confirms
 * @param {Function} props.onCancel - Callback when user cancels
 */
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-war-navy border-4 border-war-gold rounded-xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-war-red to-war-navy px-6 py-4 border-b-2 border-war-gold border-opacity-30">
          <h3 className="text-war-gold font-serif text-xl tracking-wide font-bold">
            {isPlacement && 'Confirm Deployment'}
            {isManeuver && 'Confirm Maneuver'}
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Main question */}
          <p className="text-parchment font-serif text-lg mb-5">
            {isPlacement && `Deploy ${actionData.troopCount} ${actionData.troopCount === 1 ? 'troop' : 'troops'} to ${actionData.territoryName}?`}
            {isManeuver && `Move ${actionData.troopCount} ${actionData.troopCount === 1 ? 'troop' : 'troops'} from ${actionData.fromTerritoryName} to ${actionData.territoryName}?`}
          </p>

          {/* Preview box */}
          <div className="bg-black bg-opacity-40 rounded-lg px-5 py-4 border-l-4 border-war-gold">
            <p className="text-sm text-war-gold uppercase tracking-wide mb-3 font-bold">Preview</p>

            {isPlacement && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-parchment-dark text-sm">Current garrison:</span>
                  <span className="text-parchment font-bold">{actionData.currentTroops}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-parchment-dark text-sm">After deployment:</span>
                  <span className="text-war-gold font-bold text-lg">{actionData.newTroops}</span>
                </div>
              </div>
            )}

            {isManeuver && (
              <div className="space-y-3">
                <div>
                  <p className="text-parchment-dark text-xs uppercase mb-1">{actionData.fromTerritoryName}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-parchment-dark text-sm">Current:</span>
                    <span className="text-parchment">{actionData.fromCurrentTroops}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-parchment-dark text-sm">After:</span>
                    <span className="text-war-gold font-bold">{actionData.fromNewTroops}</span>
                  </div>
                </div>
                <div className="border-t border-parchment-dark border-opacity-30 pt-2">
                  <p className="text-parchment-dark text-xs uppercase mb-1">{actionData.territoryName}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-parchment-dark text-sm">Current:</span>
                    <span className="text-parchment">{actionData.currentTroops}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-parchment-dark text-sm">After:</span>
                    <span className="text-war-gold font-bold">{actionData.newTroops}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="text-parchment-dark text-xs text-center mt-4 italic">
            Press Enter to confirm, Esc to cancel
          </p>
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 font-serif text-base rounded-lg border-2 border-parchment-dark text-parchment
                       hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer"
            style={{ minHeight: '44px' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 font-serif text-base rounded-lg bg-war-gold text-war-navy
                       hover:bg-yellow-500 transition-colors cursor-pointer font-bold"
            style={{ minHeight: '44px' }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
