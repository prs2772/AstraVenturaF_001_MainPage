## Exploration: Password Recovery Feature

### Current State
The project is an Angular application with an existing authentication module. Routes for `auth/recover-password` and `auth/reset-password` are already defined in `app.routes.ts`. Components for these pages exist in `src/app/features/auth/pages/`. The `AuthService` contains mock implementations for these features using `MOCK_MODE`. The backend endpoints were recently updated by the user to `/api/auth/forgot-password` and `/api/auth/reset-password`.

### Affected Areas
- `src/app/core/auth/auth.service.ts` — Update endpoint for password recovery and disable MOCK_MODE.
- `src/app/features/auth/models/auth-req.model.ts` — Align `ResetPasswordReq` with backend expects (`newPassword`).
- `src/app/features/auth/pages/recover-password.component.ts` — Update service call and verify logic.
- `src/app/features/auth/pages/reset-password.component.ts` — Update service call and handle matching password field.
- `src/app/features/auth/pages/register.component.html` — Add missing "Forgot Password" link.

### Approaches
1. **Update and Link (Recommended)** — Modify existing components and service to match the new backend spec and ensure all entry points (Login/Register) are correctly linked.
   - Pros: Efficient, uses existing code, aligns with user's backend changes.
   - Cons: Requires careful refactoring of existing (potentially placeholder) logic.
   - Effort: Low-Medium

### Recommendation
Proceed with updating the existing `recover-password` and `reset-password` components. Update `AuthService` to point to the correct endpoints and rename model fields to match the backend expectations.

### Risks
- **Endpoint Mismatch**: Ensure `forgot-password` vs `recover-password` naming is consistent with backend.
- **Token Handling**: Verification that tokens from URL are correctly parsed and sent.

### Ready for Proposal
Yes.
