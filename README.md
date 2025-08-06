# Ramp QA Challenge – Frontend Automation (Sign‑up & Login)

## 📌 Overview

This project automates the **sign‑up** and **login** flows for the [Ramp](https://app.ramp.com) web application using [Playwright](https://playwright.dev/) with TypeScript.  
It covers **positive**, **negative**, and **edge cases** to validate input handling, navigation, and error messaging.

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

**Scope of Coverage**

- **Sign‑up**
  - Successful account creation with valid inputs.
  - Validation for required fields, invalid formats, and password policy.
  - Handling of already registered emails.
  - Navigation to the appropriate next step (email verification or login).
- **Login**
  - Validation of correct and incorrect credentials.
  - Handling of empty or invalid inputs.
  - Navigation for password reset and switching email addresses.
  - Native HTML5 form validation and application-level error handling.

**Approach**

- **Automation Tool:** Playwright with TypeScript.
- **Execution:** Tests are run in isolated scenarios with a `beforeEach` hook navigating to the target page.
- **Assertions:** Verify text content, URL changes, element visibility, and native validation messages.
- **Positive and Negative Testing:** Includes happy-path flows and edge cases.
- **Resilience:** Tests account for both application-provided error messages and browser-native validation.

---

## 🧪 Test Cases & Steps

### **Sign‑up Scenarios**

| ID    | Scenario                   | Steps                                                                                           | Expected Result                                                        |
| ----- | -------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| SU-01 | Valid sign‑up              | 1. Navigate to `/sign-up`<br>2. Fill all fields with valid data<br>3. Submit form               | Redirects to "Verify your email" page                                  |
| SU-02 | Empty fields               | 1. Navigate to `/sign-up`<br>2. Submit without filling fields                                   | Displays "required" error for all mandatory fields                     |
| SU-03 | Invalid email format       | 1. Fill form with invalid email format<br>2. Submit                                             | Displays "Invalid email address"                                       |
| SU-04 | Weak password              | 1. Fill form with short password<br>2. Submit                                                   | Shows messages for missing length, uppercase, and numeric requirements |
| SU-05 | Password without lowercase | 1. Fill form with password containing only uppercase letters, numbers, and symbols<br>2. Submit | Displays "At least 1 lowercase character"                              |
| SU-06 | Commonly used password     | 1. Fill form with common password (e.g., `1234567890!@#`)<br>2. Submit                          | Displays "Not a commonly used password"                                |
| SU-07 | Email already registered   | 1. Sign‑up with a unique email<br>2. Repeat sign‑up with same email<br>3. Submit                | Redirects to `/sign-in`                                                |

---

### **Login Scenarios**

| ID    | Scenario                        | Steps                                                                                              | Expected Result                                                                    |
| ----- | ------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| LG-01 | "Valid" credentials (simulated) | 1. Navigate to `/sign-in`<br>2. Enter valid email<br>3. Continue<br>4. Enter password<br>5. Submit | Application shows invalid credentials message (no real login possible in test env) |
| LG-02 | Wrong password                  | 1. Enter valid email<br>2. Continue<br>3. Enter wrong password<br>4. Submit                        | Displays invalid credentials error                                                 |
| LG-03 | Empty password                  | 1. Enter valid email<br>2. Continue<br>3. Leave password empty<br>4. Submit                        | Stays on same page, password field remains visible                                 |
| LG-04 | Invalid email format            | 1. Enter invalid email<br>2. Continue                                                              | Browser native validation message contains "@"                                     |
| LG-05 | Password reset navigation       | 1. Enter valid email<br>2. Continue<br>3. Click "Reset password"                                   | Navigates to `/forgot-password`                                                    |
| LG-06 | Change email link               | 1. Enter valid email<br>2. Continue<br>3. Click "Use a different email"                            | Returns to email entry field                                                       |

---

## 📂 Project Structure

```
project-root/
│── tests/
│   ├── frontend/
│   │   ├── signup.spec.ts
│   │   ├── login.spec.ts
│── utils/
│   ├── frontend/
│       ├── email.ts
│       ├── formHelpers.ts
│       ├── password.ts
│── playwright.config.ts
│── package.json
│── README.md
```

---

## 📌 Notes

- Real login is not possible in this environment due to account restrictions; "valid" login is simulated by checking the error banner after submit.
- Email addresses for sign‑up are generated dynamically to avoid collisions with existing accounts.
- Tests are written for Chromium; cross-browser execution is possible by enabling additional browsers in `playwright.config.ts`.
