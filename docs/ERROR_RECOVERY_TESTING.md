# Error Recovery System - Testing Guide

> **Note (v1.2.0):** This document was written for v1.0.0 and references `useGameState.js`, which has been replaced by `useGameStateV2.js` with a 9-reducer architecture. The error recovery concepts remain valid but file paths and line numbers are outdated.

## Overview
This document provides testing recommendations for the comprehensive error recovery system implemented in Phase 2C Priority 3.

## Features Implemented

### 1. Error Boundaries
- **Location**: `/src/components/ErrorBoundary.jsx`
- **Coverage**:
  - GameBoard (main game area)
  - FactionSelect (startup screen)
  - TeacherDashboard (teacher view)
  - LeafletMap (automatically wrapped by GameBoard boundary)
  - EventCard (automatically wrapped by GameBoard boundary)

### 2. Auto-Save System
- **Trigger**: Every phase change
- **Location**: `/src/hooks/useGameState.js` (line ~434-451)
- **Storage**: localStorage (`war1812_save`)
- **Performance**: Non-blocking - errors won't interrupt gameplay

### 3. Save File Export/Import
- **Export**: Downloads JSON file with timestamp
- **Import**: Uploads JSON file and validates format
- **Location**: Available on FactionSelect screen and ErrorBoundary UI

### 4. Error Logging
- **Storage**: localStorage (`war1812_error_log`)
- **Limit**: Last 10 errors (prevents bloat)
- **Data**: Timestamp, error message, component stack, section

## Testing Scenarios

### Test 1: Map Component Crash
**Objective**: Verify LeafletMap errors don't crash entire app

**Steps**:
1. Open browser console
2. During gameplay, inject a crash into LeafletMap:
   ```javascript
   // Force a React error by corrupting state
   const mapContainer = document.querySelector('.leaflet-container');
   if (mapContainer) {
     // Trigger a React reconciliation error
     mapContainer.innerHTML = '';
   }
   ```
3. **Expected**: Error boundary catches it, shows recovery UI
4. **Expected**: "Restore Last Save" button appears
5. Click "Restore Last Save"
6. **Expected**: Game resumes from last auto-saved phase

**Pass Criteria**:
- Error UI displays
- Auto-save data preserved
- Game recovers successfully

---

### Test 2: Event Card Rendering Error
**Objective**: Ensure quiz errors don't lose progress

**Steps**:
1. Start a new game
2. When event card appears, open console and run:
   ```javascript
   // Corrupt the event card state
   throw new Error('Simulated quiz rendering error');
   ```
3. **Expected**: Error boundary catches error
4. **Expected**: Progress auto-saved before event card opened
5. Click "Restore Last Save"
6. **Expected**: Game state intact (troops, territories, score)

**Pass Criteria**:
- No data loss
- Student can continue from saved state

---

### Test 3: Auto-Save Verification
**Objective**: Confirm auto-save triggers on every phase advance

**Steps**:
1. Start new game and complete faction selection
2. Open browser DevTools > Application > Local Storage
3. Find `war1812_save` key
4. Advance through phases: Event → Allocate → Battle → Maneuver → Score
5. After each phase advance, check localStorage timestamp updates
6. **Expected**: `timestamp` field updates after each phase change

**Monitoring Code** (paste in console):
```javascript
setInterval(() => {
  const save = localStorage.getItem('war1812_save');
  if (save) {
    const data = JSON.parse(save);
    console.log(`Auto-save timestamp: ${new Date(data.timestamp).toLocaleTimeString()}`);
    console.log(`Phase: ${data.phase}, Round: ${data.round}`);
  }
}, 2000);
```

**Pass Criteria**:
- Save updates every phase transition
- No performance lag during save
- Gameplay continues smoothly

---

### Test 4: Export/Import Save File
**Objective**: Verify backup/restore functionality

**Steps**:
1. Start game and play for 2-3 rounds
2. On FactionSelect screen (or during crash), click "Export Backup"
3. **Expected**: JSON file downloads with format `war1812_save_YYYY-MM-DD.json`
4. Delete localStorage: `localStorage.removeItem('war1812_save')`
5. Refresh page
6. Click "Import Save File" on FactionSelect
7. Select downloaded JSON file
8. **Expected**: Alert confirms "Save file imported successfully"
9. Click "Continue Campaign"
10. **Expected**: Game resumes from exported state

**Pass Criteria**:
- Export creates valid JSON file
- Import validates file format
- Game state fully restored
- All data intact (territories, troops, journal entries, etc.)

---

### Test 5: Multiple Error Handling
**Objective**: Test error boundary resilience

**Steps**:
1. Trigger error using Test 1 method
2. Click "Restore Last Save"
3. Immediately trigger another error
4. **Expected**: Error count increments
5. **Expected**: Warning message: "This error has occurred 2 times"
6. Click "Start New Game"
7. **Expected**: Clean slate, localStorage cleared

**Pass Criteria**:
- Error boundary resets properly
- Multiple recovery attempts work
- Clear path to fresh start if needed

---

### Test 6: Invalid Save File Import
**Objective**: Test validation and error handling

**Steps**:
1. Create invalid JSON file: `{"invalid": "data"}`
2. Try to import it
3. **Expected**: Alert: "Invalid save file format"
4. Create corrupted JSON: `{invalid json`
5. Try to import it
6. **Expected**: Alert: "Invalid JSON file"

**Pass Criteria**:
- Invalid files rejected
- User receives clear error messages
- No crashes from bad data

---

### Test 7: localStorage Quota Exceeded
**Objective**: Handle storage limit errors gracefully

**Steps**:
1. Fill localStorage to near capacity:
   ```javascript
   try {
     localStorage.setItem('dummy', 'x'.repeat(5000000));
   } catch (e) {
     console.log('Storage nearly full');
   }
   ```
2. Play game and trigger phase advance
3. Check console for "Auto-save failed" warning
4. **Expected**: Game continues despite save failure
5. **Expected**: No crash or freeze

**Pass Criteria**:
- Auto-save failure logged but doesn't block gameplay
- User can still export save manually

---

### Test 8: Error Log Accumulation
**Objective**: Verify error logging and cleanup

**Steps**:
1. Trigger 15 different errors (use any method)
2. Check localStorage `war1812_error_log`
3. **Expected**: Only last 10 errors stored
4. Verify each log entry has:
   - `timestamp`
   - `error` (message)
   - `componentStack`
   - `section` (e.g., "Game Board")

**Pass Criteria**:
- Error log caps at 10 entries
- No localStorage bloat
- Teacher dashboard can access logs

---

## Performance Concerns

### Auto-Save Performance Impact

**Analysis**:
- **Frequency**: Once per phase advance (~every 30-60 seconds typical gameplay)
- **Data Size**: ~5-10KB JSON per save
- **Operation**: Synchronous localStorage write
- **Blocking Time**: <5ms on modern devices

**Monitoring**:
```javascript
// Paste in console to measure save performance
const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
  if (key === 'war1812_save') {
    const start = performance.now();
    originalSetItem(key, value);
    const duration = performance.now() - start;
    console.log(`Auto-save took ${duration.toFixed(2)}ms`);
  } else {
    originalSetItem(key, value);
  }
};
```

**Expected Results**:
- Desktop: 1-3ms
- Mobile: 3-8ms
- Slow devices: Up to 15ms

**Threshold**: If >20ms consistently, consider:
- Debouncing auto-save (only save every 2nd phase)
- Async save with requestIdleCallback
- Compress JSON before storing

**Current Status**: ✅ No performance issues expected. Auto-save is fast and non-blocking.

---

## Edge Cases to Test

### 1. Page Refresh During Event Card
- **Test**: Refresh browser while event card is visible
- **Expected**: Auto-save triggered before event, resumes at last phase

### 2. Browser Tab Close During Battle
- **Test**: Close tab mid-battle
- **Expected**: Auto-save from last phase advance available

### 3. Network Offline (GitHub Pages)
- **Test**: Disable network, continue playing
- **Expected**: Auto-save works (uses localStorage only)
- **Expected**: No network errors crash the game

### 4. Multiple Tabs Open
- **Test**: Open game in 2 tabs
- **Test**: Play in Tab 1, then switch to Tab 2
- **Expected**: Tab 2 shows stale data (no cross-tab sync)
- **Note**: This is acceptable - students should use one tab

---

## QA Checklist

- [ ] Error boundaries catch errors in GameBoard
- [ ] Error boundaries catch errors in FactionSelect
- [ ] Error boundaries catch errors in TeacherDashboard
- [ ] Auto-save triggers on every phase advance
- [ ] Auto-save doesn't cause performance lag
- [ ] Export save file creates valid JSON
- [ ] Import save file validates format
- [ ] Import save file restores full game state
- [ ] Invalid save files show clear error messages
- [ ] Error log caps at 10 entries
- [ ] Error UI shows "Restore Last Save" when available
- [ ] Error UI shows "Export Backup" button
- [ ] Multiple errors increment counter and show warning
- [ ] "Start New Game" clears localStorage
- [ ] localStorage quota errors don't crash game
- [ ] Error details are collapsible in UI
- [ ] Teacher can access error logs (via console)

---

## Manual Error Injection (for Testing)

### Method 1: Component Error
```javascript
// Inject into browser console during gameplay
setTimeout(() => {
  throw new Error('Test error for boundary testing');
}, 1000);
```

### Method 2: React Error
```javascript
// More realistic - triggers during React lifecycle
const gameBoard = document.querySelector('.leaflet-container');
if (gameBoard) {
  // Force React to throw during reconciliation
  Object.defineProperty(gameBoard, 'innerHTML', {
    set: () => { throw new Error('Simulated React error'); }
  });
}
```

### Method 3: State Corruption
```javascript
// Corrupt localStorage to trigger load errors
localStorage.setItem('war1812_save', '{invalid json}');
// Then refresh page
```

---

## Success Metrics

### Data Protection (Primary Goal)
- **Target**: 0% student progress loss from crashes
- **Measure**: No reports of lost game state after errors
- **Indicator**: Auto-save recovery success rate

### User Experience
- **Target**: <2 seconds from error to recovery UI
- **Target**: Clear, non-technical error messages
- **Target**: Export/import success rate >95%

### Performance
- **Target**: Auto-save <10ms average
- **Target**: No gameplay interruption from saves
- **Target**: <5KB localStorage usage per save

---

## Troubleshooting

### Error Boundary Not Catching Error
**Cause**: Error thrown outside React lifecycle
**Fix**: Only errors in components/render caught
**Workaround**: Use try-catch in event handlers

### Auto-Save Not Triggering
**Check**: Console for "Auto-save failed" messages
**Check**: localStorage quota (5MB limit)
**Check**: Privacy mode disabled (restricts localStorage)

### Import Save Fails
**Check**: File is valid JSON
**Check**: File has `version` and `playerFaction` keys
**Check**: Browser console for detailed error

---

## Conclusion

The error recovery system provides:
1. **Comprehensive error boundaries** around all critical UI sections
2. **Auto-save on every phase change** for data protection
3. **Export/import functionality** for manual backups
4. **User-friendly error UI** with recovery options
5. **Error logging** for teacher/developer debugging

**Data loss risk**: Minimal - auto-saves protect student work.
**Performance impact**: Negligible - <10ms per save.
**User experience**: Graceful degradation with clear recovery paths.
