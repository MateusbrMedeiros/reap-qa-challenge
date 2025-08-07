### **Login Scenarios**

| ID    | Scenario                        | Steps                                                                                              | Expected Result                                                                    |
| ----- | ------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| LG-01 | "Valid" credentials (simulated) | 1. Navigate to `/sign-in`<br>2. Enter valid email<br>3. Continue<br>4. Enter password<br>5. Submit | Application shows invalid credentials message (no real login possible in test env) |
| LG-02 | Wrong password                  | 1. Enter valid email<br>2. Continue<br>3. Enter wrong password<br>4. Submit                        | Displays invalid credentials error                                                 |
| LG-03 | Empty password                  | 1. Enter valid email<br>2. Continue<br>3. Leave password empty<br>4. Submit                        | Stays on same page, password field remains visible                                 |
| LG-04 | Invalid email format            | 1. Enter invalid email<br>2. Continue                                                              | Browser native validation message contains "@"                                     |
| LG-05 | Password reset navigation       | 1. Enter valid email<br>2. Continue<br>3. Click "Reset password"                                   | Navigates to `/forgot-password`                                                    |
| LG-06 | Change email link               | 1. Enter valid email<br>2. Continue<br>3. Click "Use a different email"                            | Returns to email entry field                                                       |
