# Delta for Auth

## ADDED Requirements

### Requirement: Secure Password Change
The system SHALL allow authenticated users to change their account password by providing their current password and a new, confirmed password.

#### Scenario: Successful Password Change
- GIVEN the user is authenticated and on the "Change Password" screen
- WHEN the user enters their correct "Current Password"
- AND the user enters a valid "New Password"
- AND the user confirms the "New Password" correctly
- AND the user submits the form
- THEN the system MUST send a POST request to `/api/auth/change-password` with `currentPassword` and `newPassword`
- AND the system MUST display a success message: "Cipher successfully updated."
- AND the system MUST redirect the user back to the Dashboard or home settings.

#### Scenario: Incorrect Current Password
- GIVEN the user is on the "Change Password" screen
- WHEN the user enters an incorrect "Current Password"
- AND submits the form
- THEN the system MUST receive a 401/403 or specific error from the backend
- AND the system MUST display an error message: "Access denied: current cipher is incorrect."
- AND the form MUSTNOT be cleared, allowing the user to retry.

#### Scenario: Unauthenticated Access Attempt
- GIVEN the user is NOT authenticated
- WHEN the user attempts to navigate to `/auth/change-password` (or the equivalent protected route)
- THEN the system MUST redirect the user to the Login page.
- AND the system MUST preserve the intended destination in the navigation state (if supported by auth guard).
