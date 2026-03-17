# Design: Change Password Feature

## Technical Approach

We will follow the existing pattern for authenticated features. The implementation consists of a service layer update, a new UI component with reactive form validation, and routing integration.

## Architecture Decisions

### Decision: Component Placement
**Choice**: Place `ChangePasswordComponent` in `src/app/features/auth/pages/`.
**Alternatives considered**: Create a new `profile` feature.
**Rationale**: Password management is logically part of the `auth` domain in this codebase, and existing password-related screens (recovery, reset) are already there.

### Decision: Entry Point
**Choice**: Add a "Security" icon/link in the `NavbarComponent` near the user avatar.
**Alternatives considered**: Add to the sidebar.
**Rationale**: User-specific settings like password changes are traditionally located in the header/navbar user menu area in modern web apps, keeping the sidebar focused on main navigation.

## Data Flow

The user interacts with the reactive form, and upon submission, the data flows to the service and then to the API:

    ChangePasswordUI (Reactive Form) ──→ AuthService.changePassword() ──→ Backend (POST /api/auth/change-password)
          │                                      │
          └───── Client-side Validation ─────────┘

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/core/auth/auth.service.ts` | Modify | Add `changePassword(req: ChangePasswordReq): Observable<void>` |
| `src/app/features/auth/models/auth-req.model.ts` | Modify | Add `ChangePasswordReq` interface. |
| `src/app/app.routes.ts` | Modify | Add `change-password` route inside the `authGuard` children. |
| `src/app/layout/navbar/navbar.component.html` | Modify | Add link to `/auth/change-password`. |
| `src/app/features/auth/pages/change-password.component.ts` | Create | Component logic with form and service call. |
| `src/app/features/auth/pages/change-password.component.html` | Create | UI using `av-glass-panel` and `av-form` styles. |
| `src/app/features/auth/pages/change-password.component.scss` | Create | Component specific styles (if needed). |

## Interfaces / Contracts

```typescript
export interface ChangePasswordReq {
    currentPassword: string;
    newPassword: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Validation Logic | Test the reactive form for mismatched passwords or empty fields. |
| Integration | API Call | Mock `HttpClient` to verify `AuthService.changePassword` calls the correct URL with correct payload. |
| E2E | Flow | Verify that a logged-in user can navigate to the page and see the success message after "changing" password (mocking success). |

## Migration / Rollout

No migration required. The feature is self-contained.

## Open Questions

- [ ] Should we force a logout after password change? (Backend usually decides this by invalidating tokens. We should follow the backend response).
