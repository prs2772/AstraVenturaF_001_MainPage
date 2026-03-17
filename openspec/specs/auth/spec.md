# Auth Specification

## Purpose
This domain handles user authentication and session management using JWT (JSON Web Tokens). It ensures that all HTTP requests to protected endpoints are properly authorized and that sessions are maintained seamlessly using refresh tokens.

## Requirements

### Requirement: Reactive JWT Refresh
The system MUST automatically attempt to refresh the access token when an HTTP request returns a `401 Unauthorized` status, provided a valid refresh token is available.

#### Scenario: Successful Token Refresh
- GIVEN the user has an expired access token but a valid refresh token
- WHEN the user performs any action that triggers an HTTP request to a protected endpoint
- THEN the system MUST intercept the 401 response
- AND the system MUST call the `/api/auth/refresh` endpoint with the refresh token
- AND the system MUST update the local storage with the new access token
- AND the system MUST retry the original request with the new access token
- AND the user MUSTNOT see any interruption or login screen

#### Scenario: Failed Token Refresh (Expired Refresh Token)
- GIVEN the user has an expired access token and an expired (or invalid) refresh token
- WHEN the user performs an action that triggers an HTTP request
- THEN the system MUST intercept the 401 response
- AND the system MUST attempt to call the `/api/auth/refresh` endpoint
- AND IF the refresh call fails (e.g., 401, 403, or 404)
- THEN the system MUST clear all session data from local storage
- AND the system MUST redirect the user to the `/auth/login` page

#### Scenario: Concurrent Protected Requests during Refresh
- GIVEN the user has an expired access token
- WHEN multiple concurrent HTTP requests are sent
- AND the first one triggers a refresh process
- THEN all subsequent requests MUST be paused and queued
- AND once the refresh process completes successfully, all queued requests MUST be replayed with the new access token

### Requirement: Authorization Header
All requests to protected endpoints (any URL not including `/auth/`) MUST include an `Authorization` header with the Bearer token.

#### Scenario: Include Token in Protected Request
- GIVEN the user is logged in with a valid access token
- WHEN a request is made to a protected endpoint (e.g., `/api/profiles`)
- THEN the request MUST include the header `Authorization: Bearer <access_token>`

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
- WHEN the user navigates to `/reset-password?token=[valid_token]`
- AND the user enters a new password (min 6 characters)
- AND the user confirms the new password
- AND the user submits
- THEN the system MUST send a request to `/api/auth/reset-password`
- AND the system MUST redirect the user to the Login page with a success notification.

#### Scenario: Expired or Invalid Token
- GIVEN the user navigates to `/reset-password?token=[expired_token]`
- WHEN the page loads
- THEN the system MUST display an error: "This link is expired or invalid. Please request a new one."
- AND the system MUST provide a link back to the recovery request page.

## Verification Plan

### Test Cases

#### TC-01: Reactive JWT Refresh
- **Unit/Integration Test (Vitest)**: Mock a `401 Unauthorized` response from a protected endpoint. Verify that the `AuthInterceptor` intercepts it and calls the `/api/auth/refresh` endpoint.
- **Unit/Integration Test (Vitest)**: Mock a successful token refresh. Verify the original request is retried with the new `Authorization` header and the user session remains active.
- **Unit/Integration Test (Vitest)**: Mock a failed token refresh (e.g., 401 on `/api/auth/refresh`). Verify the session data is cleared and the user is redirected to `/auth/login`.
- **E2E Test**: Simulate concurrent protected requests with an expired access token. Verify only one refresh API call is made, and all queued requests replay successfully once the token is refreshed.

#### TC-02: Authorization Header
- **Unit Test (Vitest)**: Fire a mock HTTP request to a protected endpoint. Verify the `AuthInterceptor` correctly appends the `Authorization: Bearer <valid_token>` header.
- **Unit Test (Vitest)**: Fire a mock HTTP request to an unprotected endpoint (`/auth/`). Verify the `Authorization` header is NOT appended.

#### TC-03: Request Password Recovery
- **Unit Test**: Enter mismatched emails in the "Forgot Password" form. Verify the submit button is disabled and the "Emails do not match" error is visible.
- **Integration Test**: Enter valid matching emails and submit. Mock the `/api/auth/recover-password` API response and verify the UI displays the success message.

#### TC-04: Password Recovery Rate Limiting
- **Integration Test**: Simulate 4 consecutive recovery requests to trigger a 429 response. Verify the frontend catches the error and displays the "Too many requests. Please try again in 2 hours." message.

#### TC-05: Secure Password Reset
- **Unit Test**: Render the reset password page with an `[expired_token]` parameter. Verify the "expired or invalid" error message blocks the form.
- **Integration Test**: Render with a valid token, submit a matching new password. Mock a success response from `/api/auth/reset-password` and verify redirection to `/auth/login` with a success notification.
