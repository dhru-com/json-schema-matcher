# JSON Template Matcher

![npm version](https://img.shields.io/npm/v/json-template-matcher.svg)

A flexible JSON template matcher for validating API responses using various operators such as `equals`, `greaterThan`, `lessThan`, `in`, `exists`, and more. This module allows you to define templates to match either **all** or **any** conditions in a JSON response.

## Installation

Install via NPM:

```bash
npm install json-template-matcher
```

## Usage

Here’s how you can use the module to match JSON responses against a template.

### Basic Example

```javascript
const { matchTemplate } = require('json-template-matcher');

// Sample JSON response
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

// Template for matching the response
const template = {
    "match": "any",  // "all" for strict matching, "any" for loose matching
    "path": {
        "status": { "equals": "OK" },
        "items[0].status": { "equals": "SUCCESS" },
        "items[1].code": { "greaterThan": 100, "lessThan": 300 },
        "items[1].status": { "in": ["FAILED", "ERROR"] },
        "results.list[0].name": { "equals": "item1", "contains": "item" },
        "results.list[2]": { "exists": false }
    }
};

// Perform the match
const result = matchTemplate(response, template);

console.log(result);  // Output: true or false based on the template conditions
```

### API

#### `matchTemplate(response, template)`

- **response**: The JSON object to be validated.
- **template**: The template defining paths and conditions.

Returns `true` or `false` based on the match conditions.

### Template Structure

The template is an object with two main properties:

- **`match`**: Specifies the match mode. Can be `"all"` (all conditions must match) or `"any"` (at least one condition must match).
- **`path`**: Defines the paths and conditions to be matched within the JSON response.

### Supported Operators

- `equals`: Matches if the value equals the expected value.
- `notEquals`: Matches if the value does not equal the expected value.
- `greaterThan`: Matches if the value is greater than the expected number.
- `lessThan`: Matches if the value is less than the expected number.
- `exists`: Matches if the key exists (`true`) or does not exist (`false`).
- `in`: Matches if the value is one of the expected values in an array.
- `contains`: Matches if a string contains the expected substring.

## Example Use Case

### Response JSON

Here’s an example of a JSON response that you might receive:

```json
{
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
}
```


