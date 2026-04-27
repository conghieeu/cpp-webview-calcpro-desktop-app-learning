import './style.css';
import { setupUI } from './js/ui.js';
import { setupKeyboard } from './js/keyboard.js';
import { loadHistory } from './js/history.js';
import { updateMemoryIndicator, updateDisplay, updateAngleButton } from './js/ui.js';

function main() {
  loadHistory();
  setupUI();
  setupKeyboard();
  updateDisplay();
  updateMemoryIndicator();
  updateAngleButton();
}

window.addEventListener('DOMContentLoaded', main);
