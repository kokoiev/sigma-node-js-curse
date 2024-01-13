#!/usr/bin/env node
const calculator = require('my-calculator-v01');

const [,, operation, num1, num2] = process.argv

if (!operation || isNaN(num1) || isNaN(num2)) {
    console.error('Usage: node index.js <operation> <num1> <num2>');
    process.exit(1);
}

switch (operation) {
    case 'add':
        console.log('Result:', calculator.add(num1, num2));
        break;
    case 'sub':
        console.log('Result:', calculator.sub(num1, num2));
        break;
    case 'mul':
        console.log('Result:', calculator.mul(num1, num2));
        break;
    case 'div':
        try {
            console.log('Result:', calculator.div(num1, num2));
        } catch (error) {
            console.error('Error:', error.message);
        }
        break;
    default:
        console.error('Invalid operation. Please use "add", "sub", "mul", or "div".');
        process.exit(1);
}
