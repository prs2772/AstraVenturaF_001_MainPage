## Exploration: Password Recovery by Email

### Current State
The application uses an Angular 21 frontend with a central `AuthService` (`src/app/core/auth/auth.service.ts`) managing authentication. Currently, it supports:
- Login (`auth/login`)
- Registration (`auth/register`)
- Token management (Access/Refresh tokens)
- User identity persistence in `localStorage`.

The backend endpoints are defined in `environments/apis.environment.ts` under `authApiUrl`.

### Affected Areas
- `src/app/app.routes.ts` — Add routes for password recovery and password reset.
- `src/app/core/auth/auth.service.ts` — Add methods for triggering recovery email and resetting password.
- `src/app/features/auth/pages/` — New components for the recovery and reset flows.
- `openspec/changes/password-recovery/backend-instructions.md` — [NEW] Instructions for backend developers.

### Approaches
1. **Frontend-Driven with Backend Instructions** — Implement the UI flow in Angular and document the required backend endpoints and rate-limiting logic.
   - Pros: Clear separation of concerns; provides immediate UI for testing integrations.
   - Cons: Depends on backend implementation to be functional.
   - Effort: Medium

2. **Full Mocking (Not recommended for production)** — Mock the backend responses in the frontend for immediate demo.
   - Pros: Immediate visual results.
   - Cons: Not a real implementation; requires rework later.
   - Effort: Low

### Recommendation
Approach 1 is the best fit. We will implement the `RecoverPassword` and `ResetPassword` components, update the `AuthService`, and provide a detailed specification for the backend implementation to handle the security requirements (rate limiting and email dispatching).

### Risks
- **Security**: The rate-limiting logic MUST be enforced on the backend by IP to avoid trivial bypasses (e.g., clearing local storage).
- **Email Delivery**: Dependent on the backend's email service configuration.
- **Token Expiration**: The reset link must have a reasonable expiration time (e.g., 1 hour), handled by the backend.

### Ready for Proposal
Yes — The requirements are clear enough to proceed with a formal change proposal.
