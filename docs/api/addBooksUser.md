## 📌 Test Strategy – `POST /BookStore/v1/Books`

This test suite verifies the behavior of the API endpoint responsible for **adding books to a user**. It includes both positive and negative scenarios to ensure robustness in user-book associations.

### 🎯 Goals

- Confirm that valid books can be added to valid users.
- Ensure duplicate books are rejected with appropriate error handling.
- Validate proper responses when adding invalid or non-existent books.
- Test authorization and user validation checks.

---

## 🧪 Test Cases – `POST /BookStore/v1/Books`

| ID    | Scenario                         | Steps                                         | Expected Result                                       |
| ----- | -------------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| BK-01 | Add one valid book to valid user | Create user → Add book with valid ISBN        | Status `201`                                          |
| BK-02 | Add the same book twice          | Add valid book → Try to add same book again   | Status `400`, message includes "ISBN already present" |
| BK-03 | Add non-existent book            | Try to add a book with fake/non-existent ISBN | Status `400`                                          |
| BK-04 | Add two valid books              | Add two different valid books in one request  | Status `201`                                          |
| BK-05 | Add book to invalid user         | Use a valid book with invalid user ID         | Status `401`                                          |
