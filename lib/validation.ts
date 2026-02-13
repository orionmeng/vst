/**
 * Input Validation Utilities
 * 
 * Provides validation functions for user input.
 */

/**
 * Validates email address format using regex
 * 
 * @param email - Email address to validate
 * @returns True if email matches pattern, false otherwise
 */
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
