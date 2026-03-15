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
