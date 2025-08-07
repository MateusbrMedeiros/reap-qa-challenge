## 📌 Test Strategy – `DELETE /BookStore/v1/Books` & `DELETE /BookStore/v1/Book`

These tests cover **removal operations** for books, including bulk deletion (`/Books`) and individual deletion (`/Book`) from a user’s collection. Both require proper authorization and a valid user context.

### 🎯 Goals

- Ensure users can delete books successfully.
- Validate authorization handling for both bulk and single deletions.
- Verify error messages when trying to delete nonexistent or already-deleted books.

---

## 🧪 Test Cases – `DELETE /BookStore/v1/Books`

| ID    | Scenario                                         | Steps                                         | Expected Result |
| ----- | ------------------------------------------------ | --------------------------------------------- | --------------- |
| BK-07 | Delete all books from user with books            | Add a book → Delete all                       | Status `204`    |
| BK-08 | Delete all books from user with empty collection | Create user without adding books → Delete all | Status `204`    |
| BK-09 | Delete all books with empty user ID              | Call delete all with empty string as `userId` | Status `401`    |
| BK-10 | Delete all books with invalid user               | Use a fake `userId` and fake credentials      | Status `401`    |
| BK-11 | Delete all books without auth                    | Send request without Authorization header     | Status `401`    |
| BK-12 | Delete all books with malformed auth             | Send request with malformed Basic token       | Status `401`    |

---

## 🧪 Test Cases – `DELETE /BookStore/v1/Book`

| ID    | Scenario                                            | Steps                                                                                                           | Expected Result                                        |
| ----- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| BK-13 | Delete valid book from user                         | Add a book → Delete it                                                                                          | Status `204`                                           |
| BK-14 | Delete book not in user's collection                | Try deleting book without adding it                                                                             | Status `400`                                           |
| BK-15 | Delete with invalid userId                          | Send request with invalid `userId`                                                                              | Status `400` or `401`                                  |
| BK-16 | Delete book without authorization                   | No auth headers → Delete                                                                                        | Status `401`                                           |
| BK-17 | Delete the same book twice                          | Add book → Delete it → Try deleting again                                                                       | First: `204`, Then: `400`                              |
| BK-18 | Delete one book and ensure the other remains intact | Add two books → Delete one via `/Book` endpoint → Retrieve user data and verify remaining book is still present | Status `204` on delete, then `GET` returns second book |
