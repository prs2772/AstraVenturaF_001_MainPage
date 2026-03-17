# Tasks: Change Password Feature

## Phase 1: Foundation

- [ ] 1.1 Add `ChangePasswordReq` interface to `src/app/features/auth/models/auth-req.model.ts`.
- [ ] 1.2 Add `changePassword(req: ChangePasswordReq)` method to `src/app/core/auth/auth.service.ts`.

## Phase 2: Implementation

- [ ] 2.1 Create `ChangePasswordComponent` in `src/app/features/auth/pages/change-password.component.ts`.
- [ ] 2.2 Create `ChangePasswordComponent` template in `src/app/features/auth/pages/change-password.component.html`.
- [ ] 2.3 Create `ChangePasswordComponent` styles in `src/app/features/auth/pages/change-password.component.scss`.
- [ ] 2.4 Register the `change-password` route in `src/app/app.routes.ts`.
- [ ] 2.5 Add entry point link in `src/app/layout/navbar/navbar.component.html`.

## Phase 3: Verification

- [ ] 3.1 Verify "Successful Password Change" scenario from delta spec.
- [ ] 3.2 Verify "Incorrect Current Password" scenario from delta spec.
- [ ] 3.3 Verify "Unauthenticated Access Attempt" redirect.
