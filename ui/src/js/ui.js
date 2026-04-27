// CalcPro — UI Controller
import { AppState } from './app.js';
import { calculate, memoryOp } from './bridge.js';
import { addHistoryEntry } from './history.js';

let expressionEl, resultEl, sciPanel, memIndicator;

function ensureElements() {
  if (!expressionEl) {
    expressionEl = document.getElementById('expression');
    resultEl = document.getElementById('result');
    sciPanel = document.getElementById('sci-panel');
    memIndicator = document.getElementById('btn-memory-indicator');
  }
}

export function updateDisplay() {
  ensureElements();
  expressionEl.textContent = AppState.currentExpression || ' ';
  resultEl.textContent = AppState.currentValue || '0';
  resultEl.classList.toggle('glow', !AppState.hasError);
  resultEl.classList.toggle('error', AppState.hasError);
  // Auto-scale font for long numbers
  const len = AppState.currentValue.length;
  if (len > 12) resultEl.style.fontSize = '32px';
  else if (len > 9) resultEl.style.fontSize = '40px';
  else resultEl.style.fontSize = '52px';
}

export function showError(message) {
  ensureElements();
  AppState.hasError = true;
  AppState.currentValue = message || 'Error';
  updateDisplay();
  resultEl.classList.add('shake');
  setTimeout(() => resultEl.classList.remove('shake'), 500);
}

export function updateMemoryIndicator() {
  ensureElements();
  memIndicator.style.display = AppState.hasMemory ? 'flex' : 'none';
}

export function updateAngleButton() {
  const btn = document.getElementById('btn-angle-toggle');
  if (btn) btn.textContent = AppState.angleUnit === 'degrees' ? 'DEG' : 'RAD';
}

// Button click handler
export async function handleAction(action) {
  if (AppState.hasError && action !== 'ac') {
    handleAction('ac');
    return;
  }

  // After pressing =, starting a new number clears the expression
  if (AppState.justEvaluated) {
    if (/^\d|\./.test(action) || action === 'negate') {
      AppState.currentExpression = '';
      AppState.currentValue = '0';
      AppState.justEvaluated = false;
    } else if (action !== 'ac' && action !== 'backspace') {
      // Keep result as start of new expression
      AppState.currentExpression = AppState.currentValue;
      AppState.justEvaluated = false;
    }
  }

  switch (action) {
    // Numbers
    case '0': case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8': case '9': {
      if (AppState.currentValue === '0' || AppState.currentValue === 'Error') {
        AppState.currentValue = action;
      } else {
        AppState.currentValue += action;
      }
      AppState.currentExpression += action;
      updateDisplay();
      break;
    }

    case '.': {
      if (!AppState.currentValue.includes('.')) {
        AppState.currentValue += '.';
        AppState.currentExpression += '.';
        updateDisplay();
      }
      break;
    }

    // Operators
    case '+': case '-': case '×': case '÷': case '%': {
      const op = action;
      AppState.currentValue = '0';
      AppState.currentExpression += ` ${op} `;
      updateDisplay();
      break;
    }

    case '=': {
      try {
        const result = await calculate(AppState.currentExpression, AppState.angleUnit);
        if (result.type === 'error') {
          showError(result.message || 'Error');
        } else {
          addHistoryEntry(AppState.currentExpression, result.value);
          AppState.currentValue = result.value;
          AppState.currentExpression = result.value;
          AppState.justEvaluated = true;
          AppState.hasError = false;
          updateDisplay();
        }
      } catch {
        showError('Error');
      }
      break;
    }

    case 'ac': {
      AppState.currentExpression = '';
      AppState.currentValue = '0';
      AppState.hasError = false;
      AppState.justEvaluated = false;
      updateDisplay();
      break;
    }

    case 'backspace': {
      if (AppState.currentValue.length > 1) {
        AppState.currentValue = AppState.currentValue.slice(0, -1);
        AppState.currentExpression = AppState.currentExpression.slice(0, -1).trim();
      } else {
        AppState.currentValue = '0';
        AppState.currentExpression = '';
      }
      updateDisplay();
      break;
    }

    case 'negate': {
      if (AppState.currentValue !== '0') {
        if (AppState.currentValue.startsWith('-')) {
          AppState.currentValue = AppState.currentValue.slice(1);
          AppState.currentExpression = AppState.currentExpression.replace(/^-/, '');
        } else {
          AppState.currentValue = '-' + AppState.currentValue;
          AppState.currentExpression = '-' + AppState.currentExpression;
        }
        updateDisplay();
      }
      break;
    }

    // Scientific
    case 'sin(': case 'cos(': case 'tan(': case 'log(': case 'ln(':
    case 'sqrt(': case 'cbrt(': case 'pow(': {
      AppState.currentExpression += action;
      AppState.currentValue = '0';
      updateDisplay();
      break;
    }

    case '^2': {
      AppState.currentExpression += '^2';
      AppState.currentValue = '0';
      updateDisplay();
      break;
    }

    case '^': {
      AppState.currentExpression += '^';
      AppState.currentValue = '0';
      updateDisplay();
      break;
    }

    case 'pi': {
      AppState.currentExpression += 'π';
      AppState.currentValue = '3.1415926536';
      updateDisplay();
      break;
    }

    case 'e': {
      AppState.currentExpression += 'e';
      AppState.currentValue = '2.7182818285';
      updateDisplay();
      break;
    }

    case '(': {
      AppState.currentExpression += '(';
      updateDisplay();
      break;
    }

    case ')': {
      AppState.currentExpression += ')';
      updateDisplay();
      break;
    }

    // Memory
    case 'mc': {
      AppState.hasMemory = false;
      AppState.memoryValue = 0;
      updateMemoryIndicator();
      break;
    }
    case 'mr': {
      AppState.currentValue = String(AppState.memoryValue);
      updateDisplay();
      break;
    }
    case 'ms': {
      AppState.hasMemory = true;
      AppState.memoryValue = parseFloat(AppState.currentValue) || 0;
      memoryOp('store', AppState.memoryValue);
      updateMemoryIndicator();
      break;
    }
    case 'm+': {
      AppState.hasMemory = true;
      AppState.memoryValue += parseFloat(AppState.currentValue) || 0;
      memoryOp('add', parseFloat(AppState.currentValue) || 0);
      updateMemoryIndicator();
      break;
    }
    case 'm-': {
      AppState.hasMemory = true;
      AppState.memoryValue -= parseFloat(AppState.currentValue) || 0;
      memoryOp('sub', parseFloat(AppState.currentValue) || 0);
      updateMemoryIndicator();
      break;
    }

    case 'angleUnit': {
      AppState.angleUnit = AppState.angleUnit === 'degrees' ? 'radians' : 'degrees';
      updateAngleButton();
      break;
    }
  }
}

// Set up all button click handlers
export function setupUI() {
  ensureElements();
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const action = btn.dataset.action;
      if (action) {
        await handleAction(action);
      }
    });
  });

  // Scientific mode toggle
  document.getElementById('btn-sci-toggle').addEventListener('click', () => {
    AppState.isScientificMode = !AppState.isScientificMode;
    sciPanel.style.display = AppState.isScientificMode ? 'block' : 'none';
  });

  // History toggle
  document.getElementById('btn-history-toggle').addEventListener('click', toggleHistory);
  document.getElementById('btn-history-close').addEventListener('click', toggleHistory);
  const overlay = document.getElementById('history-overlay');
  if (overlay) overlay.addEventListener('click', toggleHistory);
}

function toggleHistory() {
  const historyPanel = document.getElementById('history-panel');
  const historyOverlay = document.getElementById('history-overlay');
  if (!historyPanel || !historyOverlay) return;
  AppState.isHistoryOpen = !AppState.isHistoryOpen;
  historyPanel.style.display = AppState.isHistoryOpen ? 'flex' : 'none';
  historyOverlay.style.display = AppState.isHistoryOpen ? 'block' : 'none';
  // Import dynamically to avoid circular
  import('./history.js').then(h => h.renderHistory());
}
