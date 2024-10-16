const operations = {
    equals: (actual, expected) => actual === expected,
    greaterThan: (actual, expected) => actual > expected,
    lessThan: (actual, expected) => actual < expected,
    exists: (actual, expected) => (expected ? actual !== undefined : actual === undefined),
    inList: (actual, expected) => Array.isArray(expected) ? expected.includes(actual) : false,
    notInList: (actual, expected) => Array.isArray(expected) ? !expected.includes(actual) : false,
    startsWith: (actual, expected) => typeof actual === 'string' && actual.startsWith(expected),
    endsWith: (actual, expected) => typeof actual === 'string' && actual.endsWith(expected),
    notEquals: (actual, expected) => actual !== expected,
    orConditions: (actual, expected) => Array.isArray(expected) ? expected.some(condition => matchCondition(actual, condition)) : false,
    andConditions: (actual, expected) => Array.isArray(expected) ? expected.every(condition => matchCondition(actual, condition)) : false,
    referenceField: (actual, expected, response) => getValueByPath(response, expected) === actual, // Reference matching
    notCondition: (actual, expected, response) => !matchCondition(actual, expected, response), // Negation of condition
};

function matchCondition(actualValue, condition, response) {
    return Object.entries(condition).every(([operator, expected]) => {
        if (!operations[operator]) {
            console.error(`Error: Unsupported operator "${operator}" used.`);
            return false;
        }
        return operations[operator](actualValue, expected, response);
    });
}

function matchSchema(response, Schema) {
    const mode = Schema.match || "all"; // Default to "all" if not specified
    const paths = Schema.path || {};

    const results = Object.entries(paths).map(([path, condition]) => {
        const actualValue = getValueByPath(response, path);

        if (actualValue === undefined) {
            console.warn(`Warning: Path "${path}" does not exist in response.`);
            return false;
        }

        return matchCondition(actualValue, condition, response);
    });

    if (mode === "all") {
        return results.every(result => result === true);
    } else if (mode === "any") {
        return results.some(result => result === true);
    }

    return false;
}

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

module.exports = { matchSchema, getValueByPath, matchCondition };
