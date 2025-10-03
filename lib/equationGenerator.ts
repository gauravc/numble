// Equation generator for Numble game
// Generates valid equations in the format: num op num op num = result

type Operator = '+' | '-' | '*' | '/';

interface EquationConfig {
  minNumber: number;
  maxNumber: number;
  allowedOperators: Operator[];
  maxLength: number;
}

const DEFAULT_CONFIG: EquationConfig = {
  minNumber: 0,
  maxNumber: 99,
  allowedOperators: ['+', '-', '*', '/'],
  maxLength: 9, // e.g., "12+34=46" or "8*7-6=50"
};

function evaluateExpression(expression: string): number | null {
  try {
    // Remove spaces and validate characters
    const clean = expression.replace(/\s/g, '');
    if (!/^[\d+\-*/().]+$/.test(clean)) return null;

    // Evaluate left to right (no operator precedence for simplicity)
    // This matches the game behavior
    const tokens = clean.match(/(\d+|[+\-*/])/g);
    if (!tokens || tokens.length === 0) return null;

    let result = parseFloat(tokens[0]);
    let i = 1;

    while (i < tokens.length) {
      const operator = tokens[i];
      const nextNum = parseFloat(tokens[i + 1]);

      if (isNaN(nextNum)) return null;

      switch (operator) {
        case '+':
          result += nextNum;
          break;
        case '-':
          result -= nextNum;
          break;
        case '*':
          result *= nextNum;
          break;
        case '/':
          if (nextNum === 0) return null;
          result /= nextNum;
          break;
        default:
          return null;
      }

      i += 2;
    }

    return result;
  } catch {
    return null;
  }
}

function generateEquation(config: EquationConfig = DEFAULT_CONFIG): string {
  const { minNumber, maxNumber, allowedOperators } = config;

  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    attempts++;

    // Generate 2-3 numbers and 1-2 operators
    const numCount = Math.random() > 0.5 ? 2 : 3;
    const numbers: number[] = [];
    const operators: Operator[] = [];

    for (let i = 0; i < numCount; i++) {
      numbers.push(Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber);
    }

    for (let i = 0; i < numCount - 1; i++) {
      operators.push(allowedOperators[Math.floor(Math.random() * allowedOperators.length)]);
    }

    // Build expression
    let expression = numbers[0].toString();
    for (let i = 0; i < operators.length; i++) {
      expression += operators[i] + numbers[i + 1];
    }

    // Evaluate
    const result = evaluateExpression(expression);

    if (result === null || !Number.isInteger(result) || result < 0 || result > 999) {
      continue;
    }

    const equation = `${expression}=${result}`;

    // Check length constraint (typically 7-9 characters)
    if (equation.length >= 7 && equation.length <= 9) {
      return equation;
    }
  }

  // Fallback to a simple equation
  return '1+2=3';
}

function getDailyEquation(date: Date = new Date()): string {
  // Generate a deterministic equation based on the date
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

  // Simple seeded random number generator
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Generate equation using seeded random
  let random = seededRandom(seed);

  const equations = [
    '8*7-6=50',
    '12+34=46',
    '9*8-1=71',
    '45-23=22',
    '6*9-4=50',
    '15+27=42',
    '8*8+1=65',
    '54-18=36',
    '7*6+8=50',
    '99-33=66',
    '5*9-3=42',
    '36+28=64',
    '6*7-2=40',
    '81-45=36',
    '9*5+7=52',
    '17+28=45',
    '8*6-9=39',
    '72-36=36',
    '4*9+6=42',
    '23+19=42',
  ];

  const index = Math.floor(random * equations.length);
  return equations[index];
}

function isValidEquation(equation: string): boolean {
  const parts = equation.split('=');
  if (parts.length !== 2) return false;

  const [expression, resultStr] = parts;
  const expectedResult = parseInt(resultStr, 10);

  if (isNaN(expectedResult)) return false;

  const actualResult = evaluateExpression(expression);
  return actualResult === expectedResult;
}

export {
  generateEquation,
  getDailyEquation,
  isValidEquation,
  evaluateExpression,
  type Operator,
  type EquationConfig,
};
