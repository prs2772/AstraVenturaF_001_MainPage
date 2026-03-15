# Proposal: Fix JWT Refresh

## Intent

To prevent users from being forcefully logged out after 11 minutes of inactivity (or whenever the access token expires). The current implementation fails to refresh the token because it attempts to call an incorrect endpoint (`/api/auth/auth/refresh`), resulting in a 404 error which triggers a logout fallback.

## Scope

### In Scope
- Correct the endpoint URL in `AuthService.refreshToken()`.
- Update `JwtInterceptor` to correctly identify the refresh request path.
- Ensure the reactive refresh logic pauses and replays pending requests successfully.

### Out of Scope
- Changing the 11-minute expiration time (backend controlled).
- Implementing proactive background timers (Approach 1 from exploration was chosen).

## Approach

We will fix the reactive refresh strategy by:
1. Modifying `AuthService.refreshToken()` to call `${this.base}/refresh` instead of `${this.base}/auth/refresh` (since `this.base` already includes `/auth`).
2. Updating `JwtInterceptor`'s exclusion filter to use the correct path.
3. Verifying that the `BehaviorSubject` and `switchMap` logic in the interceptor correctly replays requests after the new token is received.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/core/auth/auth.service.ts` | Modified | Fix `refreshToken` endpoint URL. |
| `src/app/core/interceptors/jwt.interceptor.ts` | Modified | Update URL check for refresh requests. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Refresh token itself is expired | Low | System will naturally logout the user (correct behavior). |
| Network timeout during refresh | Low | Interceptor already handles errors; will retry or logout as safe fallback. |

## Rollback Plan

Revert the changes in `auth.service.ts` and `jwt.interceptor.ts` to restore the previous (broken) URL logic.

## Dependencies

- Backend API must keep the `/api/auth/refresh` endpoint (Postman verification confirmed it works).

## Success Criteria

- [ ] HTTP requests made after 11 minutes trigger a successful 401 -> Refresh -> Replay flow.
- [ ] User is NOT redirected to `/auth/login` when a refresh is possible.
- [ ] Console does not show 404 errors for `/auth/refresh`.
