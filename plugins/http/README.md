# Rita Plugin HTTP

Fetches an URL and expects an JSON object as response. This JSON object will then be used to enrich the data.

## Usage

```json5
{
    type: 'plugin',
    name: 'http',
    options: {
        url: 'https://example.com/api',
    },
    formula: {
        type: 'atom',
        path: 'keyInResponse',
    },
}
```
