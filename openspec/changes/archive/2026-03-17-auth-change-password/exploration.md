## Exploration: Change Password Feature

### Current State
The application has a robust authentication system using JWT. It already handles login, registration, password recovery, and reset flows. However, there is no interface for an authenticated user to change their password from within the application. The backend has recently added the `/api/auth/change-password` endpoint.

### Affected Areas
- `src/app/core/auth/auth.service.ts` — Adding the `changePassword` method.
- `src/app/features/auth/models/auth-req.model.ts` — Adding the `ChangePasswordReq` interface.
- `src/app/app.routes.ts` — Adding a protected route for the new screen.
- `src/app/layout/navbar/navbar.component.html` — Potential location for the "Change Password" link.
- `openspec/specs/auth/spec.md` — Will require a delta spec to document this new requirement.

### Approaches
1. **Integrated Settings Page** — Create a broader "Settings" or "Profile" feature where "Change Password" is just one section.
   - Pros: Scalable for future user settings.
   - Cons: Higher complexity for the current immediate need.
   - Effort: Medium

2. **Dedicated Change Password Screen** — Create a focused component under the `auth` feature that is only accessible to logged-in users.
   - Pros: Fast implementation, focuses on the specific request.
   - Cons: Might feel isolated if we add more settings later.
   - Effort: Low

### Recommendation
I recommend **Approach 2 (Dedicated Change Password Screen)**. We can create a new component `ChangePasswordComponent` in `features/auth/pages` and route it through the main layout's children. For the entry point, we can add a simple "Security" or "Change Password" icon/button in the `NavbarComponent` next to the user info.

### Risks
- **Security**: Must ensure the user is authenticated and the session is fresh (though the backend handles validation, the frontend must handle 401/403 correctly).
- **UX**: Ensure the form matches the premium "Orbital" aesthetic of the existing auth screens.

### Ready for Proposal
Yes — I have all the endpoint details and a clear plan for the component and routing integration.
