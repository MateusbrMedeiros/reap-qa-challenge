## 📌 Test Strategy – `GET /BookStore/v1/Books`

This test validates the **public endpoint** that retrieves the full list of available books from the system. No authentication is required for this operation.

### 🎯 Goals

- Ensure the API returns a successful response.
- Validate that the response includes a list of books.
- Confirm that the structure and data format is correct.

---

## 🧪 Test Cases – `GET /BookStore/v1/Books`

| ID    | Scenario           | Steps                          | Expected Result                                                      |
| ----- | ------------------ | ------------------------------ | -------------------------------------------------------------------- |
| BK-06 | Retrieve all books | Send `GET` request to `/Books` | Status `200`, response includes array `books` with one or more items |
