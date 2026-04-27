// CalcPro — History Management
import { AppState } from './app.js';
import { handleAction } from './ui.js';

const STORAGE_KEY = 'calcpro_history';

export function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      AppState.history = JSON.parse(stored);
    }
  } catch {
    AppState.history = [];
  }
}

export function saveHistory() {
  try {
    // Keep max 50 entries
    if (AppState.history.length > 50) {
      AppState.history = AppState.history.slice(-50);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState.history));
  } catch {
    // Storage full or unavailable
  }
}

export function addHistoryEntry(expression, result) {
  AppState.history.push({
    expression,
    result,
    timestamp: Date.now()
  });
  saveHistory();
}

export function clearHistory() {
  AppState.history = [];
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
}

export function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;

  if (AppState.history.length === 0) {
    list.innerHTML = '<div class="history-empty">No calculations yet</div>';
    return;
  }

  list.innerHTML = AppState.history.map((entry, index) =>
    `<div class="history-item" data-index="${index}">
      <div class="hist-expr">${escapeHtml(entry.expression)}</div>
      <div class="hist-result">= ${escapeHtml(entry.result)}</div>
    </div>`
  ).join('');

  // Click to reuse result
  list.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const index = parseInt(el.dataset.index);
      const entry = AppState.history[index];
      if (entry) {
        AppState.currentValue = entry.result;
        AppState.currentExpression = entry.result;
        AppState.hasError = false;
        AppState.justEvaluated = true;
        // Trigger display update
        import('./ui.js').then(m => m.updateDisplay());
        // Close history
        document.getElementById('btn-history-close').click();
      }
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Clear button
document.addEventListener('DOMContentLoaded', () => {
  const clearBtn = document.getElementById('btn-history-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearHistory);
  }
});
