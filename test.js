const { matchTemplate } = require('./index');

const response = {
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

const template = {
    "match": "any",
    "path": {
        "status": { "equals": "OK" },
        "items[0].status": { "equals": "SUCCESS" },
        "items[1].code": { "greaterThan": 100, "lessThan": 300 },
        "items[1].status": { "in": ["FAILED", "ERROR"] },
        "results.list[0].name": { "equals": "item1", "contains": "item" },
        "results.list[2]": { "exists": false }
    }
};

console.log(matchTemplate(response, template)); // Should print true
