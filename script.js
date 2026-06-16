let display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Update the display
function updateDisplay() {
    display.value = currentInput;
}

// Append a number to the current input
function appendNumber(number) {
    // Prevent multiple leading zeros
    if (currentInput === '0' && number === '0') {
        return;
    }

    // Prevent multiple decimal points
    if (number === '.' && currentInput.includes('.')) {
        return;
    }

    // Reset display if a new calculation started
    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        // Replace leading zero with new number
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }

    updateDisplay();
}

// Append an operator
function appendOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    // If there's a previous operator, calculate first
    if (operator && !shouldResetDisplay) {
        calculate();
    }

    previousInput = currentInput;
    operator = nextOperator;
    shouldResetDisplay = true;
}

// Perform the calculation
function calculate() {
    if (operator === null || shouldResetDisplay) {
        return;
    }

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    let result;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                updateDisplay();
                resetCalculator();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    // Handle floating point precision issues
    result = Math.round(result * 100000000) / 100000000;

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// Clear everything
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Delete the last character
function deleteLast() {
    if (shouldResetDisplay) {
        return;
    }

    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

// Reset calculator after error or calculation
function resetCalculator() {
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
}

// Initialize display on page load
updateDisplay();

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+' || e.key === '-') {
        appendOperator(e.key);
    } else if (e.key === '*') {
        e.preventDefault();
        appendOperator('*');
    } else if (e.key === '/') {
        e.preventDefault();
        appendOperator('/');
    } else if (e.key === '%') {
        appendOperator('%');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});
