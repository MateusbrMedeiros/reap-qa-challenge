## 📌 Test Strategy – `GET /Account/v1/User`

These tests validate the **retrieval of user data** using their unique ID, ensuring proper authorization handling and appropriate response behavior for both valid and invalid inputs.

### 🎯 Goals

- Verify that valid users can be retrieved by their ID using a valid token.
- Ensure authorization is enforced with proper status codes.
- Check API behavior when invalid or empty user IDs are provided.

---

## 🧪 Test Cases – `GET /Account/v1/User`

| ID    | Scenario                       | Steps                                                                          | Expected Result                                |
| ----- | ------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------- |
| AC-04 | Get user by valid ID           | Create user → Generate token → Call `/Account/v1/User/{userId}`                | Status `200`, returns correct user data        |
| AC-05 | Get user with empty ID         | Create user → Generate token → Call `/Account/v1/User/` (no ID)                | Status `200`, but response contains HTML error |
| AC-06 | Get user with invalid ID       | Create user → Generate token → Call with ID `"1"`                              | Status `401`                                   |
| AC-07 | Get user without Authorization | Create user → Call `/Account/v1/User/{userId}` without auth header             | Status `401`                                   |
| AC-08 | Get user with malformed token  | Create user → Call `/Account/v1/User/{userId}` with `Bearer INVALID.TOKEN.123` | Status `401`                                   |
