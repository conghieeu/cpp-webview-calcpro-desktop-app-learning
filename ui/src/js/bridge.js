// CalcPro — C++ Communication Bridge

export async function calculate(expression, angleUnit) {
  // Try C++ backend first
  if (window.calculate) {
    try {
      const result = await window.calculate(expression, angleUnit || 'degrees');
      return JSON.parse(result);
    } catch {
      // Fall through to JS fallback
    }
  }
  // JS fallback
  const { evaluate } = await import('./calculator.js');
  const res = evaluate(expression, angleUnit || 'degrees');
  if (res.error) {
    return { type: 'error', code: 'EVAL_ERROR', message: res.error };
  }
  return { type: 'result', value: formatValue(res.value), fullValue: res.value };
}

export async function memoryOp(operation, value) {
  if (window.memoryOp) {
    try {
      const result = await window.memoryOp(operation, value);
      return JSON.parse(result);
    } catch {
      // fallback
    }
  }
  return { type: 'memory', value: 0, hasValue: false };
}

export async function setAngleUnit(unit) {
  if (window.setAngleUnit) {
    try {
      await window.setAngleUnit(unit);
    } catch {
      // fallback
    }
  }
}

function formatValue(num) {
  if (Number.isInteger(num) && Math.abs(num) < 1e15) return String(num);
  const s = num.toPrecision(10);
  // Remove trailing zeros
  const dot = s.indexOf('.');
  if (dot !== -1) {
    const trimmed = s.replace(/\.?0+$/, '');
    return trimmed;
  }
  return s;
}
