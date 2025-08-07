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
