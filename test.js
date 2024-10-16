
const { matchSchema } = require('./index');
const { validateSchema } = require('./index');

// Test case 1: Matching basic schema
const response1 = {
    "status": "OK",
    "items": [
        { "status": "SUCCESS", "code": 123 },
        { "status": "FAILED", "code": 200 }
    ]
};

const schema1 = {
    "match": "any",
    "path": {
        "status": { "equals": "OK" },
        "items[1].code": { "greaterThan": 100 }
    }
};

console.log('Test 1 Validate Schema (should be true):', validateSchema(schema1)) ; // Should return true
console.log('Test 1 (should be true):', matchSchema(response1, schema1)); // Should return true

// Test case 2: Matching nested and array values
const response2 = {
    "status": "OK",
    "items": [
        { "status": "SUCCESS", "code": 123 },
        { "status": "FAILED", "code": 200 }
    ],
    "results": {
        "list": [
            { "name": "item1", "value": 50 },
            { "name": "item2", "value": 75 }
        ]
    }
};

const schema2 = {
    "match": "all",
    "path": {
        "status": { "equals": "OK" },
        "items[1].code": { "greaterThan": 100, "lessThan": 300 },
        "results.list[0].name": { "startsWith": "item" }
    }
};

console.log('Test 2 (should be true):', matchSchema(response2, schema2)); // Should return true

// Test case 3: Using inList and notEquals
const response3 = {
    "status": "OK",
    "role": "admin",
    "score": 87
};

const schema3 = {
    "match": "all",
    "path": {
        "role": { "inList": ["admin", "moderator"] },
        "score": { "greaterThan": 80, "notEquals": 100 }
    }
};

console.log('Test 3 (should be true):', matchSchema(response3, schema3)); // Should return true

// Test case 4: Negation (notCondition)
const response4 = {
    "status": "FAILURE",
    "code": 500
};

const schema4 = {
    "match": "all",
    "path": {
        "status": { "notCondition": { "equals": "SUCCESS" } },
        "code": { "equals": 500 }
    }
};

console.log('Test 4 (should be true):', matchSchema(response4, schema4)); // Should return true

// Test case 5: Reference field
const response5 = {
    "createdAt": "2022-10-01",
    "updatedAt": "2022-10-01"
};

const schema5 = {
    "match": "all",
    "path": {
        "createdAt": { "equals": "2022-10-01" },
        "updatedAt": { "referenceField": "createdAt" }
    }
};

console.log('Test 5 (should be true):', matchSchema(response5, schema5)); // Should return true
