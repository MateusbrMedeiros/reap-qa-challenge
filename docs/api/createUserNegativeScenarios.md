## 📌 Test Strategy – `POST /Account/v1/User` (Negative Scenarios)

This test suite targets **invalid or malformed user creation requests**, ensuring the API returns proper validation and error responses while handling edge cases gracefully.

### 🎯 Goals

- Validate that user creation fails when inputs are missing or invalid.
- Ensure the API does not crash when receiving malformed or unexpected payloads.
- Test how the system handles duplicate users and invalid data types.

---

## 🧪 Test Cases – `POST /Account/v1/User` (Negative Scenarios)

| ID    | Scenario                      | Steps                                                        | Expected Result                                     |
| ----- | ----------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| AC-09 | Missing username              | Send only a valid password                                   | Status `400`                                        |
| AC-10 | Empty username and password   | Send both fields as empty strings                            | Status `400`                                        |
| AC-11 | Duplicate user                | Create user → Try to create again with same username         | Status `406`, error message contains "User exists!" |
| AC-12 | Username too long             | Send `userName` with 256+ characters                         | Status `400` or `502`                               |
| AC-13 | Wrong data types              | Send numeric username and boolean password                   | Status `400` or `502`                               |
| AC-14 | Malformed JSON                | Send invalid JSON payload manually                           | Status `400` or `502`                               |
| AC-15 | Missing `Content-Type` header | Send request without `Content-Type: application/json` header | Status `400` or `502`                               |
