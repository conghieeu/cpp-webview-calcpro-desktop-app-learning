// CalcPro — Keyboard Shortcuts
import { handleAction } from './ui.js';
import { AppState } from './app.js';

export function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    // Don't capture if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key;

    // Numbers
    if (/^[0-9]$/.test(key)) {
      handleAction(key);
      return;
    }

    // Operators
    switch (key) {
      case '+': handleAction('+'); break;
      case '-': handleAction('-'); break;
      case '*': handleAction('×'); break;
      case '/': handleAction('÷'); break;
      case '%': handleAction('%'); break;
      case '^': handleAction('^'); break;
      case '.': case ',': handleAction('.'); break;
      case 'Enter': case '=': handleAction('='); break;
      case 'Backspace': handleAction('backspace'); break;
      case 'Escape': handleAction('ac'); break;
      case '(': handleAction('('); break;
      case ')': handleAction(')'); break;

      // Scientific shortcuts
      case 's': handleAction('sin('); break;
      case 'c': handleAction('cos('); break;
      case 't': handleAction('tan('); break;
      case 'l': handleAction('log('); break;
      case 'n': handleAction('ln('); break;
      case 'q': handleAction('sqrt('); break;
      case 'p': handleAction('pi'); break;

      // Toggle shortcuts
      case 'h':
        AppState.isHistoryOpen = !AppState.isHistoryOpen;
        document.getElementById('history-panel').style.display =
          AppState.isHistoryOpen ? 'flex' : 'none';
        document.getElementById('history-overlay').style.display =
          AppState.isHistoryOpen ? 'block' : 'none';
        if (AppState.isHistoryOpen) {
          import('./history.js').then(m => m.renderHistory());
        }
        break;
      case 'm':
        AppState.isScientificMode = !AppState.isScientificMode;
        document.getElementById('sci-panel').style.display =
          AppState.isScientificMode ? 'block' : 'none';
        break;
    }
  });
}
