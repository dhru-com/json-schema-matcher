
# JSON Schema Matcher

![npm version](https://img.shields.io/npm/v/json-template-matcher.svg)


A flexible JSON schema matcher for validating API responses using full operator names.

## Installation

```bash
npm install json-schema-matcher
```

## Usage

Here’s how you can use the module to match JSON responses against a schema.

### Basic Example

```javascript
const { matchSchema } = require('json-schema-matcher');

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

// Schema for matching the response
const schema = {
    "match": "any",
    "path": {
        "status": { "equals": "OK" },
        "items[0].status": { "notEquals": "ERROR" },
        "items[1].code": { "greaterThan": 100, "lessThan": 300 },
        "items[1].status": { "inList": ["FAILED", "ERROR"] },
        "results.list[0].name": { "startsWith": "item", "contains": "item" },
        "results.list[2]": { "exists": false },
        "items[0].code": { "notCondition": { "equals": 200 } }
    }
};

console.log(matchSchema(response, schema)); // Will output true or false
```

### Supported Operators

| Operator          | Description                                             | Example Link                                                   |
|-------------------|---------------------------------------------------------|----------------------------------------------------------------|
| `equals`          | Matches if the value equals the expected value           | [Example](#1-equals)                                            |
| `notEquals`       | Matches if the value does not equal the expected value   | [Example](#2-notequals)                                         |
| `greaterThan`     | Matches if the value is greater than the expected value  | [Example](#3-greaterthan)                                       |
| `lessThan`        | Matches if the value is less than the expected value     | [Example](#4-lessthan)                                          |
| `exists`          | Checks if the field exists or not                        | [Example](#5-exists)                                            |
| `inList`          | Checks if the value is in the list                       | [Example](#6-inlist)                                            |
| `notInList`       | Checks if the value is not in the list                   | [Example](#7-notinlist)                                         |
| `startsWith`      | Checks if the string starts with the expected substring  | [Example](#8-startswith)                                        |
| `endsWith`        | Checks if the string ends with the expected substring    | [Example](#9-endswith)                                          |
| `orConditions`    | Matches if at least one condition is true                | [Example](#10-orconditions)                                     |
| `andConditions`   | Matches if all conditions are true                       | [Example](#11-andconditions)                                    |
| `referenceField`  | Matches if the value equals another field in the document| [Example](#12-referencefield)                                   |
| `notCondition`    | Negates the condition                                    | [Example](#13-notcondition)                                     |

### Operator Examples

#### 1. `equals`

```javascript
const response = { "status": "OK" };
const schema = { 
  "match": "all",
  "path": { 
    "status": { "equals": "OK" }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 2. `notEquals`

```javascript
const response = { "status": "FAILED" };
const schema = { 
  "match": "all",
  "path": { 
    "status": { "notEquals": "SUCCESS" }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 3. `greaterThan`

```javascript
const response = { "score": 90 };
const schema = { 
  "match": "all",
  "path": { 
    "score": { "greaterThan": 80 }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 4. `lessThan`

```javascript
const response = { "age": 25 };
const schema = { 
  "match": "all",
  "path": { 
    "age": { "lessThan": 30 }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 5. `exists`

```javascript
const response = { "name": "John" };
const schema = { 
  "match": "all",
  "path": { 
    "name": { "exists": true },
    "age": { "exists": false }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 6. `inList`

```javascript
const response = { "role": "admin" };
const schema = { 
  "match": "all",
  "path": { 
    "role": { "inList": ["admin", "moderator"] }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 7. `notInList`

```javascript
const response = { "role": "guest" };
const schema = { 
  "match": "all",
  "path": { 
    "role": { "notInList": ["admin", "moderator"] }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 8. `startsWith`

```javascript
const response = { "name": "John" };
const schema = { 
  "match": "all",
  "path": { 
    "name": { "startsWith": "Jo" }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 9. `endsWith`

```javascript
const response = { "name": "Johnson" };
const schema = { 
  "match": "all",
  "path": { 
    "name": { "endsWith": "son" }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 10. `orConditions`

```javascript
const response = { "status": "OK" };
const schema = { 
  "match": "all",
  "path": { 
    "status": { 
      "orConditions": [
        { "equals": "FAILED" },
        { "equals": "OK" }
      ] 
    }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 11. `andConditions`

```javascript
const response = { "score": 95 };
const schema = { 
  "match": "all",
  "path": { 
    "score": { 
      "andConditions": [
        { "greaterThan": 90 },
        { "lessThan": 100 }
      ] 
    }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 12. `referenceField`

```javascript
const response = { "createdAt": "2022-10-01", "updatedAt": "2022-10-01" };
const schema = { 
  "match": "all",
  "path": { 
    "updatedAt": { "referenceField": "createdAt" }
  }
};
console.log(matchSchema(response, schema)); // true
```

#### 13. `notCondition`

```javascript
const response = { "status": "FAILED" };
const schema = { 
  "match": "all",
  "path": { 
    "status": { 
      "notCondition": { "equals": "SUCCESS" }
    }
  }
};
console.log(matchSchema(response, schema)); // true
```

## License

MIT
