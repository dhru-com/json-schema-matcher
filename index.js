const operations = {
    equals: (actual, expected) => actual === expected,
    greaterThan: (actual, expected) => actual > expected,
    lessThan: (actual, expected) => actual < expected,
    exists: (actual, expected) => (expected ? actual !== undefined : actual === undefined),
    in: (actual, expected) => expected.includes(actual),
    notEquals: (actual, expected) => actual !== expected,
    contains: (actual, expected) => actual.includes(expected),
};

/**
 * Match a template against a JSON response based on the match mode ("all" or "any").
 * @param {Object} response - The JSON object to be validated.
 * @param {Object} template - The matching template with paths, conditions, and match type.
 * @returns {boolean} - Returns true if the response matches based on the template mode.
 */
function matchTemplate(response, template) {
    const mode = template.match || "all"; // Default to "all" if not specified
    const paths = template.path || {};

    const results = Object.entries(paths).map(([path, condition]) => {
        const actualValue = getValueByPath(response, path);

        if (actualValue === undefined) {
            console.warn(`Warning: Path "${path}" does not exist in response.`);
            return false;
        }

        return Object.entries(condition).every(([operator, expected]) => {
            if (!operations[operator]) {
                console.error(`Error: Unsupported operator "${operator}" used.`);
                return false;
            }
            return operations[operator](actualValue, expected);
        });
    });

    if (mode === "all") {
        return results.every(result => result === true);
    } else if (mode === "any") {
        return results.some(result => result === true);
    }

    return false;
}

/**
 * Helper function to retrieve value from a nested object using a path.
 * @param {Object} obj - The object to traverse.
 * @param {string} path - The dot-separated path to the value.
 * @returns {*} - The value at the specified path, or undefined if the path does not exist.
 */
function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, key) => {
        const arrayMatch = key.match(/^([a-zA-Z0-9_]+)\[(\d+)\]$/);
        if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const index = parseInt(arrayMatch[2], 10);
            return acc && acc[arrayKey] && acc[arrayKey][index];
        }
        return acc && acc[key];
    }, obj);
}

module.exports = { matchTemplate, getValueByPath };
