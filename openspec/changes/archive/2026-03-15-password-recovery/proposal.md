# Proposal: Password Recovery Feature

## Intent
Provide users with a secure way to recover their access if they forget their password. This involves an email-driven recovery flow and strict rate limiting to prevent abuse.

## Scope

### In Scope
- [NEW] `RecoverPasswordComponent`: UI to request a recovery link via email (with confirmation field).
- [NEW] `ResetPasswordComponent`: UI to set a new password using a token from the link.
- [NEW] Backend instructions for email dispatch, token generation, and reset logic.
- [MOD] `AuthService`: New methods `recoverPassword` and `resetPassword`.
- [MOD] `app.routes.ts`: New routes for the recovery flow.
- Implementation of client-side validation for email confirmation.
- UI state management for success/error messages.

### Out of Scope
- Actual implementation of the email-sending service (Backend).
- Actual database updates for passwords (Backend).
- IP-based session blocking logic (Backend).

## Approach
The feature will be implemented as a new module or a set of components within the `auth` feature.
1. **Frontend**: Two new pages added to the `auth` domain.
2. **Service**: `AuthService` expanded to handle the new API calls.
3. **Routing**: New public routes added to `app.routes.ts`.
4. **Security**: We will rely on backend IP-based rate limiting as per the instructions, but will also implement a simple frontend cooldown timer to improve UX and discourage spamming.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/app.routes.ts` | Modified | Added routes `/auth/recover-password` and `/auth/reset-password`. |
| `src/app/core/auth/auth.service.ts` | Modified | Added `recoverPassword(email)` and `resetPassword(token, password)` methods. |
| `src/app/features/auth/pages/` | New | `recover-password.component` and `reset-password.component`. |
| `openspec/changes/password-recovery/` | New | Change documentation (exploration, proposal, specifications). |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| User enters wrong email | Med | Use email confirmation field (double entry) and specific validators. |
| IP Rate limiting bypass | Med | Ensure backend implementation follows the "3 per hour, 2-hour block" rule strictly. |
| Token hijacking | Low | Use HTTPS for all communications and ensure tokens are short-lived. |

## Rollback Plan
Since this change primarily adds new files and routes, rollback involves:
1. Reverting changes to `app.routes.ts` and `auth.service.ts`.
2. Deleting the new components in `src/app/features/auth/pages/`.
3. Removing the new documentation in `openspec/changes/`.

## Dependencies
- Backend implementation of `POST /api/auth/recover-password` and `POST /api/auth/reset-password`.

## Success Criteria
- [ ] User can navigate to the recovery page from the login screen.
- [ ] User can submit their email (confirmed) and see a success message.
- [ ] The `AuthService` sends the correct payload to the backend endpoints.
- [ ] The reset page correctly captures the token from the URL and allows setting a new password.
