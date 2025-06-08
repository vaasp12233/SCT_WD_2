document.addEventListener('DOMContentLoaded', () => {
 const calculator = {
     displayValue: '0',
     firstOperand: null,
     waitingForSecondOperand: false,
     operator: null,
 };

 const updateDisplay = () => {
     const currentOperandElement = document.getElementById('current-operand');
     const previousOperandElement = document.getElementById('previous-operand');
     
     currentOperandElement.textContent = calculator.displayValue;
     
     if (calculator.firstOperand !== null && calculator.operator) {
         previousOperandElement.textContent = 
             `${calculator.firstOperand} ${calculator.operator}`;
     } else {
         previousOperandElement.textContent = '';
     }
 };

 const inputDigit = (digit) => {
     const { displayValue, waitingForSecondOperand } = calculator;
     
     if (waitingForSecondOperand === true) {
         calculator.displayValue = digit;
         calculator.waitingForSecondOperand = false;
     } else {
         calculator.displayValue = 
             displayValue === '0' ? digit : displayValue + digit;
     }
 };

 const inputDecimal = (dot) => {
     if (calculator.waitingForSecondOperand) {
         calculator.displayValue = '0.';
         calculator.waitingForSecondOperand = false;
         return;
     }
     
     if (!calculator.displayValue.includes(dot)) {
         calculator.displayValue += dot;
     }
 };

 const handleOperator = (nextOperator) => {
     const { firstOperand, displayValue, operator } = calculator;
     const inputValue = parseFloat(displayValue);
     
     if (operator && calculator.waitingForSecondOperand) {
         calculator.operator = nextOperator;
         return;
     }
     
     if (firstOperand === null) {
         calculator.firstOperand = inputValue;
     } else if (operator) {
         const result = performCalculation[operator](firstOperand, inputValue);
         
         calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
         calculator.firstOperand = result;
     }
     
     calculator.waitingForSecondOperand = true;
     calculator.operator = nextOperator;
 };

 const performCalculation = {
     '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
     '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
     '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
     '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
 };

 const resetCalculator = () => {
     calculator.displayValue = '0';
     calculator.firstOperand = null;
     calculator.waitingForSecondOperand = false;
     calculator.operator = null;
 };

 const deleteLastDigit = () => {
     if (calculator.displayValue.length === 1) {
         calculator.displayValue = '0';
     } else {
         calculator.displayValue = calculator.displayValue.slice(0, -1);
     }
 };

 const handleEquals = () => {
     if (calculator.operator === null || calculator.waitingForSecondOperand) {
         return;
     }
     
     const inputValue = parseFloat(calculator.displayValue);
     
     if (calculator.operator === '/' && inputValue === 0) {
         alert("Division by zero is not allowed!");
         resetCalculator();
         updateDisplay();
         return;
     }
     
     const result = performCalculation[calculator.operator](
         calculator.firstOperand,
         inputValue
     );
     
     calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
     calculator.firstOperand = null;
     calculator.waitingForSecondOperand = false;
     calculator.operator = null;
 };

 const handleButtonClick = (e) => {
     const { target } = e;
     if (!target.matches('button')) return;
     
     const action = target.getAttribute('data-action');
     const value = target.textContent;
     
     switch (action) {
         case 'number':
             inputDigit(value);
             break;
         case 'decimal':
             inputDecimal(value);
             break;
         case 'divide':
         case 'multiply':
         case 'subtract':
         case 'add':
             handleOperator(value === '×' ? '*' : value);
             break;
         case 'equals':
             handleEquals();
             break;
         case 'clear':
             resetCalculator();
             break;
         case 'delete':
             deleteLastDigit();
             break;
     }
     
     updateDisplay();
 };

 const handleKeyboardInput = (e) => {
     const { key } = e;
     
     if (key >= '0' && key <= '9') {
         inputDigit(key);
     } else if (key === '.') {
         inputDecimal(key);
     } else if (key === '+' || key === '-' || key === '*' || key === '/') {
         handleOperator(key);
     } else if (key === 'Enter' || key === '=') {
         handleEquals();
     } else if (key === 'Escape') {
         resetCalculator();
     } else if (key === 'Backspace') {
         deleteLastDigit();
     } else {
         return;
     }
     
     updateDisplay();
     e.preventDefault();
 };

 document.querySelector('.calculator').addEventListener('click', handleButtonClick);
 document.addEventListener('keydown', handleKeyboardInput);
 
 // Initialize display
 updateDisplay();
});