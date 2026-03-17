# Tasks: Password Recovery Feature

## Phase 1: Foundation
- [ ] 1.1 Add `recoverPassword` and `resetPassword` methods to `src/app/core/auth/auth.service.ts` with basic HTTP POST implementation.
- [ ] 1.2 Define `RecoverPasswordReq` and `ResetPasswordReq` interfaces in `src/app/features/auth/models/auth-req.model` if they don't exist.
- [ ] 1.3 Update `src/app/app.routes.ts` to include `/auth/recover-password` and `/auth/reset-password` paths.

## Phase 2: Core Implementation
- [ ] 2.1 Create `src/app/features/auth/pages/recover-password.component.ts` with Reactive Form (email and confirm email).
- [ ] 2.2 Create `src/app/features/auth/pages/recover-password.component.html` using existing login page styles for consistency.
- [ ] 2.3 Implement email matching validator in `recover-password.component.ts`.
- [ ] 2.4 Create `src/app/features/auth/pages/reset-password.component.ts` with token extraction logic from query params and password entry form.
- [ ] 2.5 Create `src/app/features/auth/pages/reset-password.component.html` with new password and confirmation input.

## Phase 3: Integration & UX
- [ ] 3.1 Wire up "Forgot Password" link in `src/app/features/auth/pages/login.component.html`.
- [ ] 3.2 Implement success/error handling in both components, displaying user-friendly messages for 429 (Rate Limit) errors.
- [ ] 3.3 Add a simple frontend countdown state for the 2-hour lockout UI indication.

## Phase 4: Testing & Verification
- [ ] 4.1 Verify `recoverPassword` API call payload matches backend instructions.
- [ ] 4.2 Verify `resetPassword` API call payload includes the token from URL.
- [ ] 4.3 Manually verify validation errors for mismatched emails and mismatched passwords.
- [ ] 4.4 Verify navigation flow: Login -> Forgot Password -> Submit Email -> Redirect/Success message.
