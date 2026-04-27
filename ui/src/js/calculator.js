// CalcPro — JS-side Calculator (fallback)
// Uses Shunting-Yard algorithm for expression evaluation

const FUNCTIONS = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  log: Math.log10, ln: Math.log, sqrt: Math.sqrt, cbrt: Math.cbrt,
};

const CONSTANTS = { pi: Math.PI, e: Math.E };

const PRECEDENCE = { '+': 2, '-': 2, '*': 3, '/': 3, '%': 3, '^': 4 };
const ASSOC = { '+': 'L', '-': 'L', '*': 'L', '/': 'L', '%': 'L', '^': 'R' };

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    if (/\s/.test(expr[i])) { i++; continue; }
    if (/\d/.test(expr[i]) || expr[i] === '.') {
      let num = '';
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) num += expr[i++];
      tokens.push({ type: 'NUMBER', value: parseFloat(num) });
      continue;
    }
    if (/[a-zA-Z]/.test(expr[i])) {
      let name = '';
      while (i < expr.length && /[a-zA-Z]/.test(expr[i])) name += expr[i++];
      name = name.toLowerCase();
      if (CONSTANTS[name] !== undefined) {
        tokens.push({ type: 'NUMBER', value: CONSTANTS[name] });
      } else if (FUNCTIONS[name] !== undefined) {
        tokens.push({ type: 'FUNCTION', value: name });
      } else {
        tokens.push({ type: 'NUMBER', value: 0 });
      }
      continue;
    }
    if ('+-*/%^()×÷−'.includes(expr[i])) {
      if ((expr[i] === '-' || expr[i] === '+') && (tokens.length === 0 || tokens[tokens.length - 1].type === 'OPERATOR' || tokens[tokens.length - 1].type === 'LPAREN')) {
        tokens.push({ type: 'NUMBER', value: 0 });
        tokens.push({ type: 'OPERATOR', value: expr[i] === '-' ? '-' : '+' });
      } else if (expr[i] === '(') {
        tokens.push({ type: 'LPAREN' });
      } else if (expr[i] === ')') {
        tokens.push({ type: 'RPAREN' });
      } else {
        // Map display operators
        let op = expr[i];
        if (op === '×') op = '*';
        if (op === '÷') op = '/';
        if (op === '−') op = '-';
        tokens.push({ type: 'OPERATOR', value: op });
      }
      i++;
      continue;
    }
    if (expr[i] === '×' || expr[i] === '÷' || expr[i] === '−') {
      let op = expr[i];
      if (op === '×') op = '*';
      if (op === '÷') op = '/';
      if (op === '−') op = '-';
      tokens.push({ type: 'OPERATOR', value: op });
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

function shuntingYard(tokens) {
  const output = [];
  const opStack = [];
  for (const tok of tokens) {
    if (tok.type === 'NUMBER') {
      output.push(tok);
    } else if (tok.type === 'FUNCTION') {
      opStack.push(tok);
    } else if (tok.type === 'OPERATOR') {
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1];
        if (top.type !== 'OPERATOR') break;
        const p1 = PRECEDENCE[tok.value] || 0;
        const p2 = PRECEDENCE[top.value] || 0;
        if ((ASSOC[tok.value] === 'L' && p1 <= p2) || (ASSOC[tok.value] === 'R' && p1 < p2)) {
          output.push(opStack.pop());
        } else break;
      }
      opStack.push(tok);
    } else if (tok.type === 'LPAREN') {
      opStack.push(tok);
    } else if (tok.type === 'RPAREN') {
      while (opStack.length > 0 && opStack[opStack.length - 1].type !== 'LPAREN') {
        output.push(opStack.pop());
      }
      opStack.pop(); // discard (
      if (opStack.length > 0 && opStack[opStack.length - 1].type === 'FUNCTION') {
        output.push(opStack.pop());
      }
    }
  }
  while (opStack.length > 0) output.push(opStack.pop());
  return output;
}

function evaluateRPN(rpn, angleUnit) {
  const stack = [];
  const toRad = (d) => angleUnit === 'degrees' ? d * Math.PI / 180 : d;

  for (const tok of rpn) {
    if (tok.type === 'NUMBER') {
      stack.push(tok.value);
    } else if (tok.type === 'FUNCTION') {
      const a = stack.pop();
      if (tok.value === 'sin') stack.push(Math.sin(toRad(a)));
      else if (tok.value === 'cos') stack.push(Math.cos(toRad(a)));
      else if (tok.value === 'tan') {
        const cosv = Math.cos(toRad(a));
        if (Math.abs(cosv) < 1e-12) throw new Error('Undefined');
        stack.push(Math.tan(toRad(a)));
      } else if (tok.value === 'log') {
        if (a <= 0) throw new Error('Invalid Input');
        stack.push(Math.log10(a));
      } else if (tok.value === 'ln') {
        if (a <= 0) throw new Error('Invalid Input');
        stack.push(Math.log(a));
      } else if (tok.value === 'sqrt') {
        if (a < 0) throw new Error('Invalid Input');
        stack.push(Math.sqrt(a));
      } else if (tok.value === 'cbrt') {
        stack.push(Math.cbrt(a));
      } else {
        stack.push(0);
      }
    } else if (tok.type === 'OPERATOR') {
      if (stack.length < 2) throw new Error('Not enough operands');
      const b = stack.pop();
      const a = stack.pop();
      switch (tok.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          stack.push(a / b);
          break;
        case '%':
          if (b === 0) throw new Error('Division by zero');
          stack.push(a % b);
          break;
        case '^': stack.push(Math.pow(a, b)); break;
      }
    }
  }
  if (stack.length === 0) throw new Error('No result');
  return stack.pop();
}

export function evaluate(expression, angleUnit = 'degrees') {
  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) return { value: 0 };
    const rpn = shuntingYard(tokens);
    const result = evaluateRPN(rpn, angleUnit);
    return { value: result };
  } catch (e) {
    return { error: e.message };
  }
}
