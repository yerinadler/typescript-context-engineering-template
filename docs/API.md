# API

## Specification
### Structure of the response
| Field | Description |
| --- | ----------- |
| code | The business specific code which encompasses both normal response and error response |
| Paragraph | Text |
### Base Response
The base response for all API is

```typescript
type BaseResponse<T = unknown> = {
  code: string;
  message: string;
  data?: T;
};
```
The `data` field can be omitted as not every API returns the data.

For example, a simple 200 OK response looks like this
```json
{
  "code": "000",
  "message": "Ok",
}
```
If data is about to be included, then
```json
{
  "code": "000",
  "message": "Get user list",
  "data": [
    { "name": "John Doe" }
  ]
}
```

### Error Response
The error response is a bit different from base response

```typescript
type BaseErrorResponse = {
  code: string;
  error: string;
}
```