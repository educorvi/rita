# Rita Plugin HTTP

Fetches an URL and expects an JSON object as response. This JSON object will then be used to enrich the data.

## Usage

```json
{
    "type": "plugin",
    "name": "http",
    "options": {
        "url": "https://example.com/api",
        "method": "GET"
    },
    "formula": {
        "type": "atom",
        "path": "keyInResponse"
    }
}
```

### Options

-   `url` is the url to fetch from.
-   `method` (optional) is the HTTP method to use. Currently `GET` and `POST` are supported.
    When `POST` is selected, the current data will be passed via the requests body.
