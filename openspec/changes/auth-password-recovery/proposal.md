# Proposal: Password Recovery Implementation

## Intent
The goal is to implement the full password recovery flow (forgot and reset) in the Angular application, connecting the existing frontend pages to the newly updated backend API endpoints: `/api/auth/forgot-password` and `/api/auth/reset-password`.

## Scope

### In Scope
- Update `AuthService` to use the correct backend endpoints.
- Rename `passwordNew` to `newPassword` in models and components.
- Enable live API calls in `AuthService` (disable `MOCK_MODE`).
- Add "Forgot Password" link to the Registration page.
- Ensure the Login page link correctly points to the recovery flow.
- Verify that both recovery and reset flows match the specification (matching email validation, rate limit handling).

### Out of Scope
- Backend implementation (user stated it's already done).
- New styling (using existing styles).

## Approach
We will leverage the existing placeholder components and `AuthService` methods. The primary work involves aligning the frontend models and service calls with the backend API and ensuring consistent navigation links across the auth module.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/core/auth/auth.service.ts` | Modified | Update endpoints and disable MOCK_MODE. |
| `src/app/features/auth/models/auth-req.model.ts` | Modified | Rename `passwordNew` to `newPassword`. |
| `src/app/features/auth/pages/recover-password.component.ts` | Modified | Update service call. |
| `src/app/features/auth/pages/reset-password.component.ts` | Modified | Update service call and field binding. |
| `src/app/features/auth/pages/register.component.html` | Modified | Add "Forgot Password" link. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| API Endpoint mismatch | Medium | Verify with user if "forgot-password" or "recover-password" is the exact name. |
| Token parsing issues | Low | Add logging during verification. |

## Rollback Plan
Revert changes to `AuthService` and components using Git.

## Dependencies
- Backend API must be accessible at `/api/auth/forgot-password` and `/api/auth/reset-password`.

## Success Criteria
- [ ] Users can navigate to "Forgot Password" from both Login and Register.
- [ ] Succesful forgot password request displays success message.
- [ ] Token from email link is correctly passed to the reset password page.
- [ ] Succesful password reset redirects to Login.
