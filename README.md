# Reap QA Challenge – Frontend & API Automation (Sign-up, Login & BookStore API)

## 📌 Overview

This project automates both **frontend** and **API** flows for the [Ramp](https://app.ramp.com) web application using [Playwright](https://playwright.dev/) with TypeScript.

- On the **frontend**, it validates the **sign‑up** and **login** flows through UI interactions.
- On the **backend**, it covers full **API test coverage** for the BookStore service, including user creation, authentication, and book management operations.

It includes **positive**, **negative**, and **edge cases** to ensure robust input handling, proper authorization, consistent navigation, and accurate error messaging.

---

## 🚀 How to Run the Tests

### 1. Install Dependencies

```bash
npm install
```

### 2. Run All Tests

```bash
npx playwright test
```

### 3. Run a Specific File

```bash
npx playwright test tests/frontend/signup.spec.ts
npx playwright test tests/frontend/login.spec.ts
```

### 4. Run Headed (see the browser)

```bash
npx playwright test --headed
```

---

## 🎯 Test Strategy

**Objective**  
Validate that the Ramp sign‑up and login pages handle user input, validations, and navigation correctly for both valid and invalid cases, ensuring a consistent user experience and enforcing security rules for credentials.

## ✅ Scope of Coverage

### 🔐 Sign‑up

- Successful account creation with valid inputs.
- Validation for required fields, invalid formats, and password policy.
- Handling of already registered emails.
- Navigation to the appropriate next step (email verification or login).

### 🔓 Login

- Validation of correct and incorrect credentials.
- Handling of empty or invalid inputs.
- Navigation for password reset and switching email addresses.
- Native HTML5 form validation and application-level error handling.

### 📚 BookStore API

- **User Creation:** Positive and negative flows for creating users, including special character support, duplicate accounts, and malformed inputs.
- **Authentication & Token Generation:** Token creation with valid and invalid credentials, including missing or malformed headers.
- **User Retrieval:** Validation of authorized access, correct user data, and error scenarios for missing or invalid IDs.
- **Book Management:**
  - Fetching the public list of books.
  - Adding single or multiple books to a user.
  - Attempting to add invalid or duplicate books.
  - Updating a book (replacing ISBN) with proper auth and valid structure.
  - Deleting all books or a single book from a user’s collection.
  - Error handling for invalid users, empty collections, malformed requests, and missing auth.

---

## 🧪 Approach

- **Automation Tool:** Playwright with TypeScript.
- **Execution:**
  - Frontend: Tests run in isolated browser contexts with `beforeEach` navigation.
  - API: Tests use Playwright’s `APIRequestContext`.
- **Assertions:**
  - Frontend: Text content, URLs, visibility, native validation.
  - API: Status codes, payload validation, error messages.
- **Test Types:**
  - Positive (happy path)
  - Negative (edge/error cases)
- **Resilience:** Full-stack validations for robustness.

---

## 📂 Project Structure

```

PROJECTLOGINAPI/
├── .github/
│ └── workflows/
│ └── playwright.yml
│
├── docs/
│ ├── api/
│ │ ├── addBooksUser.md
│ │ ├── createUser.md
│ │ ├── createUserNegativeScenarios.md
│ │ ├── deleteBooksUser.md
│ │ ├── deleteUser.md
│ │ ├── getBooks.md
│ │ ├── getUser.md
│ │ └── updateBookUser.md
│ │
│ └── frontend/
│ ├── login.md
│ └── signup.md
│
├── playwright-report/
├── test-results/
│
├── tests/
│ ├── api/
│ │ ├── account.create.spec.ts
│ │ ├── account.delete.spec.ts
│ │ ├── account.get.spec.ts
│ │ ├── account.negative.spec.ts
│ │ ├── account.password.spec.ts
│ │ ├── addBooksUser.spec.ts
│ │ ├── bookstore.get.spec.ts
│ │ ├── deleteBookUser.spec.ts
│ │ └── updateBookUser.spec.ts
│ │
│ └── frontend/
│ ├── login.spec.ts
│ └── signup.spec.ts
│
├── utils/
│ ├── api/
│ │ ├── accountHelpers.ts
│ │ ├── booksHelpers.ts
│ │ └── userHelpers.ts
│ │
│ └── frontend/
│ ├── email.ts
│ ├── formHelpers.ts
│ └── password.ts
│
├── .gitignore
└── README.md

```

---

## 📌 Notes

- Real login is not possible in this environment due to account restrictions; "valid" login is simulated by checking the error banner after submit.
- Email addresses for sign‑up are generated dynamically to avoid collisions with existing accounts.
- Tests are written for Chromium; cross-browser execution is possible by enabling additional browsers in `playwright.config.ts`.
