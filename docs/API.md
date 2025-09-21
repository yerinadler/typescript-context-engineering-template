# API

## Specification
### Structure of the response

### Base Response
The base response for all API is

```typescript
type BaseResponse<T = unknown> = {
  code: string;
  message: string;
  data?: T;
};
```
The `data` field can be omitted as not every API returns the data. Use `createSuccessResponse` from `src/shared/api` to build compliant payloads.

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

Applications can use `createErrorResponse` from `src/shared/api` to standardize error payloads.


## Standard Response Codes

| Business Code        | HTTP Status Code | Scenario |
|----------------------|------------------|----------|
| success              | 200              | Any successful scenarios e.g. queries, updates, or requests |
| created              | 201              | Successful creation of a new entity |
| accepted             | 202              | Request accepted but not yet completed (e.g. async processing) |
| no_content           | 204              | Successful operation but no response body (e.g. delete) |
| bad_request          | 400              | Client error, invalid request syntax, parameters, or payload |
| not_authenticated    | 401              | Request cannot succeed due to missing/invalid authentication |
| not_authorized       | 403              | Request denied due to insufficient permissions |
| not_found            | 404              | The requested resource does not exist |
| method_not_allowed   | 405              | Request used an unsupported HTTP method for this resource |
| conflict             | 409              | Conflict detected (duplicate, concurrency error, version mismatch) |
| validation_error     | 422              | Semantic validation failed (data format correct but invalid business rules) |
| too_many_requests    | 429              | Request rate limit exceeded or throttled |
| internal_error       | 500              | Internal server error without sufficient context (fallback error) |
| not_implemented      | 501              | Requested functionality is not implemented |
| bad_gateway          | 502              | Invalid response received from upstream dependency/service |
| service_unavailable  | 503              | Service temporarily unavailable (e.g. dependency down, maintenance) |
| gateway_timeout      | 504              | Service did not respond in time (timeout) |

---

### Notes & Best Practices
- **`422 validation_error` vs `400 bad_request`**:  
  - Use `400` for syntactic errors (wrong query param, missing field).  
  - Use `422` when the request is syntactically correct but fails business rules (e.g. invalid date range, invalid state transition).  

- **`202 accepted`**: Good for async APIs where you enqueue a job but don’t process immediately.  

- **`204 no_content`**: Helpful for delete operations to avoid returning unnecessary JSON payloads.  

- **`429 too_many_requests`**: Essential for APIs with rate limits.  

- **`503 service_unavailable` & `504 gateway_timeout`**: Useful when you depend on external services or databases that may fail.  