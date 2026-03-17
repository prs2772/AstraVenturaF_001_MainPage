# Delta for Auth

## ADDED Requirements

### Requirement: Request Password Recovery
The system SHALL provide a public interface for users to initiate password recovery by providing their registered email address.

#### Scenario: Successful Recovery Request
- GIVEN the user is on the Login page
- WHEN the user clicks "Forgot Password"
- AND the user enters their email in both the primary and confirmation email fields
- AND both emails match and are valid
- AND the user submits the form
- THEN the system MUST send a request to `/api/auth/recover-password`
- AND the system MUST display a success message: "If the email is registered, you will receive a recovery link shortly."

#### Scenario: Mismatched Confirmation Email
- GIVEN the user is on the Recover Password page
- WHEN the user enters `user@example.com` in the email field
- AND enters `other@example.com` in the confirmation field
- THEN the system MUST disable the "Send Link" button
- AND the system MUST display a validation error: "Emails do not match."

### Requirement: Password Recovery Rate Limiting
The system MUST enforce rate limiting based on the user's IP address to prevent brute-force attacks and abuse of the email service.

#### Scenario: Rate Limit Threshold Reached (3 requests/hour)
- GIVEN a single IP address has already made 3 recovery requests within the last 60 minutes
- WHEN a 4th request is initiated from the same IP
- THEN the system MUST block the request (via Backend response 429)
- AND the system MUST display a message: "Too many requests. Please try again in 2 hours."
- AND the system MUST enforce a 2-hour lockout for that IP.

### Requirement: Secure Password Reset
The system SHALL allow users to set a new password via a unique, time-limited token delivered by email.

#### Scenario: Set New Password with Valid Token
- GIVEN the user has received a recovery email and clicked the link
- WHEN the user navigates to `/auth/reset-password?token=[valid_token]`
- AND the user enters a new password (min 6 characters)
- AND the user confirms the new password
- AND the user submits
- THEN the system MUST send a request to `/api/auth/reset-password`
- AND the system MUST redirect the user to the Login page with a success notification.

#### Scenario: Expired or Invalid Token
- GIVEN the user navigates to `/auth/reset-password?token=[expired_token]`
- WHEN the page loads
- THEN the system MUST display an error: "This link is expired or invalid. Please request a new one."
- AND the system MUST provide a link back to the recovery request page.
