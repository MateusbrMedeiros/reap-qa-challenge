## 📌 Test Strategy – `PUT /BookStore/v1/Books/{ISBN}`

These tests validate the update flow of a user’s book. This endpoint allows users to replace a book in their collection with another one using ISBN codes. Proper authorization and valid user/book context are required.

### 🎯 Goals

- Ensure books can be successfully updated for a valid user.
- Confirm error handling when updating invalid or nonexistent data.
- Validate authorization requirements and ISBN format rules.

---

## 🧪 Test Cases – `PUT /BookStore/v1/Books/{ISBN}`

| ID    | Scenario                         | Steps                                                     | Expected Result |
| ----- | -------------------------------- | --------------------------------------------------------- | --------------- |
| BK-19 | Successfully update book         | Add book A → Replace with book B for the same user        | Status `200`    |
| BK-20 | Update non-existent book         | Try updating a book that was never added                  | Status `400`    |
| BK-21 | Invalid auth on update           | Add book → Try updating with fake/malformed Authorization | Status `401`    |
| BK-22 | Invalid ISBN format              | Add valid book → Try updating with malformed ISBN string  | Status `400`    |
| BK-23 | Update book for nonexistent user | Use a fake userId in the payload                          | Status `401`    |
