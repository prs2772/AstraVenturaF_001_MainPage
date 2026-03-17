# Backend Implementation Instructions: Password Recovery

The frontend requires the following updates to the Authentication API to support password recovery.

## 1. Request Password Recovery Endpoint
- **Endpoint**: `POST /api/auth/recover-password`
- **Payload**: `{ "email": "string" }`
- **Logic**:
    - Verify if the email exists in the system.
    - If it exists, generate a unique, time-limited token (UUID or secure hash).
    - Store the token associated with the user and an expiration timestamp (e.g., 1 hour).
    - Send an email to the user with a link: `https://[app-url]/auth/reset-password?token=[token]`.
    - **Security (Rate Limiting)**:
        - Limit requests by **IP Address**.
        - Maximum 3 requests within a rolling 60-minute window.
        - If the limit is exceeded, block further requests from that IP for **2 hours**.
        - Return `429 Too Many Requests` with a clear message and the time remaining for the block.
    - **Response**:
        - Success: `200 OK` (Always return 200 even if email doesn't exist, to avoid email enumeration).

## 2. Reset Password Endpoint
- **Endpoint**: `POST /api/auth/reset-password`
- **Payload**: `{ "token": "string", "newPassword": "string" }`
- **Logic**:
    - Validate the token.
    - Check if the token is expired.
    - Update the user's password in the database.
    - Invalidate the token after use.
- **Response**:
    - Success: `200 OK`
    - Failure: `400 Bad Request` (Invalid or expired token).

## 3. Email Template
- **Subject**: Password Recovery - Astra Ventura
- **Body**:
    ```text
    Hello,
    
    You requested a password recovery. Click the link below to set a new password:
    [Link]
    
    This link will expire in 1 hour. If you did not request this, please ignore this email.
    ```
