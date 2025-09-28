// src/lib/utils/persian-numbers.ts

/**
 * Converts English numbers in a string to Persian numbers.
 * @param {string | number} input The string or number to be converted.
 * @returns {string} The string with converted numbers.
 */
export function convertNumbersToPersian(input: string | number): string {
    const englishNumbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const persianNumbers: string[] = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    // Convert the input to a string to handle both number and string types
    const inputString = String(input);

    let result = '';

    for (let i = 0; i < inputString.length; i++) {
        const char = inputString[i];
        const index = englishNumbers.indexOf(char);
        if (index !== -1) {
            result += persianNumbers[index];
        } else {
            result += char;
        }
    }
    return result;
}