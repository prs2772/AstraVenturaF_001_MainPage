# Proposal: Change Password Feature

## Intent

The goal is to allow authenticated users to change their security cipher (password) from within the application. This enhances security by providing a self-service way to update credentials without requiring a full account recovery flow.

## Scope

### In Scope
- Create `ChangePasswordReq` model.
- Add `changePassword` method to `AuthService`.
- Implement `ChangePasswordComponent` with current password and new password fields.
- Integrate the new screen into the protected routing system.
- Add an entry point (button/link) in the `NavbarComponent`.
- Ensure the UI matches the AstraVentura premium aesthetic.

### Out of Scope
- Password complexity policy enforcement (beyond basic validation) if not provided by backend.
- Multi-factor authentication (MFA) or email confirmation for this specific change.

## Approach

We will implement a dedicated screen `ChangePasswordComponent` that will be accessible only to authenticated users. This component will be added as a child route of the main `LayoutComponent`. The `AuthService` will be updated to handle the `/api/auth/change-password` POST request.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/core/auth/auth.service.ts` | Modified | Add `changePassword` method. |
| `src/app/features/auth/models/auth-req.model.ts` | Modified | Add `ChangePasswordReq` interface. |
| `src/app/app.routes.ts` | Modified | Add `/auth/change-password` protected route. |
| `src/app/layout/navbar/navbar.component.html` | Modified | Add link to the new screen. |
| `src/app/features/auth/pages/` | New | Create `change-password.component.{ts,html,scss}`. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Session Timeout | Medium | Use existing `authInterceptor` to handle token refresh or redirect to login. |
| Validation Errors | Low | Implement robust client-side validation and handle backend error messages. |

## Rollback Plan

Revert the changes to the routes and service files. Since this is a new feature, removing the routes and entry points will effectively disable it without affecting existing functionality.

## Dependencies

- Backend endpoint `/api/auth/change-password` must be functional.

## Success Criteria

- [ ] User can navigate to the Change Password screen when logged in.
- [ ] Submitting correct current and new passwords updates the password successfully.
- [ ] Submitting incorrect current password displays an appropriate error message.
- [ ] Screen is NOT accessible to unauthenticated users.
