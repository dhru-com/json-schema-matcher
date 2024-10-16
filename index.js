// Define the available operations for comparison, logical conditions, and string matching.
const operations = {
    equals: (actual, expected) => actual === expected,
    greaterThan: (actual, expected) => actual > expected,
    lessThan: (actual, expected) => actual < expected,
    exists: (actual, expected) => expected ? actual !== undefined : actual === undefined,
    inList: (actual, expected) => Array.isArray(expected) && expected.includes(actual),
    notInList: (actual, expected) => Array.isArray(expected) && !expected.includes(actual),
    startsWith: (actual, expected) => typeof actual === 'string' && actual.startsWith(expected),
    endsWith: (actual, expected) => typeof actual === 'string' && actual.endsWith(expected),
    notEquals: (actual, expected) => actual !== expected,
    orConditions: (actual, expected) => Array.isArray(expected) && expected.some(condition => matchCondition(actual, condition)),
    andConditions: (actual, expected) => Array.isArray(expected) && expected.every(condition => matchCondition(actual, condition)),
    referenceField: (actual, expected, response) => getValueByPath(response, expected) === actual,  // Match against value at a reference path
    notCondition: (actual, expected, response) => !matchCondition(actual, expected, response)  // Negate the condition match result
};

/**
 * Evaluates a condition based on the provided actual value and the expected condition using defined operations.
 *
 * @param {any} actualValue - The actual value from the response object.
 * @param {Object} condition - The condition object defining the operation to apply.
 * @param {Object} response - The full response object used for referenceField operations.
 * @returns {boolean} - True if the condition is met, false otherwise.
 */
function matchCondition(actualValue, condition, response) {
    return Object.entries(condition).every(([operator, expected]) => {
        const operation = operations[operator];
        if (!operation) {
            console.error(`Error: Unsupported operator "${operator}" used.`);
            return false;
        }
        return operation(actualValue, expected, response);
    });
}

/**
 * Matches the response against a defined schema of conditions, supporting "all" or "any" matching modes.
 *
 * @param {Object} response - The object to be validated against the schema.
 * @param {Object} schema - The schema defining the path-based conditions.
 * @returns {boolean} - True if the response matches the schema according to the specified mode.
 */
function matchSchema(response, schema) {
    const mode = schema.match || "all";  // Default match mode is "all"
    const paths = schema.path || {};

    const results = Object.entries(paths).map(([path, condition]) => {
        const actualValue = getValueByPath(response, path);

        if (actualValue === undefined) {
            console.warn(`Warning: Path "${path}" does not exist in response.`);
            return false;
        }

        return matchCondition(actualValue, condition, response);
    });

    return mode === "all" ? results.every(Boolean) : results.some(Boolean);
}

/**
 * Retrieves a value from an object by following a dot-separated path. Supports array indexing.
 *
 * @param {Object} obj - The object from which to extract the value.
 * @param {string} path - The path string, e.g., "user.profile.name" or "items[0].id".
 * @returns {any} - The value found at the path, or undefined if the path is not valid.
 */
function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, key) => {
        const arrayMatch = key.match(/^([a-zA-Z0-9_]+)\[(\d+)\]$/);
        if (arrayMatch) {
            const [_, arrayKey, index] = arrayMatch;
            return acc?.[arrayKey]?.[parseInt(index, 10)];
        }
        return acc?.[key];
    }, obj);
}

module.exports = { matchSchema, getValueByPath, matchCondition };
