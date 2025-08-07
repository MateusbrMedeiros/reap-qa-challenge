---
## 🗑️ Test Strategy – `DELETE /Account/v1/User`

This test suite validates the behavior of the **user deletion endpoint** under both **valid** and **invalid** scenarios. It ensures that:
  - Authorized deletion works as expected.
  - Proper error handling is in place for missing or malformed tokens.
  - Edge cases like empty or non-existent user IDs are handled gracefully.
  - Security behavior remains consistent when trying to reuse invalid tokens or re-delete a user.

  ### 🎯 Goals

  - Validate successful user deletion flow with correct Bearer token.
  - Confirm consistent error messaging and status codes for edge cases.
  - Ensure idempotency and security by testing already-deleted users and invalid tokens.
---

## 🧪 Test Cases – `DELETE /Account/v1/User`

| ID     | Scenario                     | Steps                                                                              | Expected Result                               |
| ------ | ---------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------- |
| DEL-01 | Valid user deletion          | Create a user → Generate token → Delete with Bearer token                          | Status `204` returned                         |
| DEL-02 | Invalid user ID              | Create user → Generate token → Try deleting `00000000-0000-0000-0000-000000000000` | Status `200`, message: "User Id not correct!" |
| DEL-03 | Empty user ID                | Create user → Generate token → Attempt DELETE without providing ID in URL          | Status `404` returned                         |
| DEL-04 | Missing Authorization header | Attempt to delete user with only Accept header                                     | Status `401` returned                         |
| DEL-05 | Malformed token              | Attempt to delete valid user using `Bearer malformed.token.here`                   | Status `401` returned                         |
| DEL-06 | Delete already deleted user  | Delete valid user once → Attempt to delete again with same token                   | Status `200`, message: "User Id not correct!" |
