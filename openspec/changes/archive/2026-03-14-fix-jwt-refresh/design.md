# Design: Fix JWT Refresh

## Technical Approach

We will fix the reactive refresh strategy by correcting the endpoint construction in `AuthService` and ensuring the `JwtInterceptor` properly excludes the refresh call from its own interception logic. This aligns with the "Approach 1" recommendation from the exploration.

## Architecture Decisions

### Decision: Correcting URL Construction
**Choice**: Change `refreshToken()` inside `AuthService` to use `${this.base}/refresh`.
**Alternatives considered**: Changing `apis.authApiUrl` in `environments/apis.environment.ts`.
**Rationale**: The environment variable `authApiUrl` is defined as `.../api/auth`. This is a standard base URL for the auth service. Other methods in `AuthService` (like `login` and `register`) already append sub-paths correctly (e.g., `${this.base}/login`). Appending `/auth/refresh` was a redundancy that led to the 404.

### Decision: Update Interceptor Filter
**Choice**: Update `JwtInterceptor`'s `handle401Error` check and its global exclusion check to specifically look for `/refresh` without the duplicated `/auth` segment.
**Rationale**: Consistency with the corrected `AuthService` method.

## Data Flow

1.  **Request Failure**: A protected request returns `401 Unauthorized`.
2.  **Interception**: `JwtInterceptor` catches 401.
3.  **Refresh Trigger**: Interceptor calls `authService.refreshToken()`.
4.  **API Call (Corrected)**: POST made to `/api/auth/refresh`.
5.  **Token Storage**: `JwtInterceptor` saves the new `accessToken`.
6.  **Replay**: `JwtInterceptor` replays the original failed request (and any queued requests) with the new `Authorization` header.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/core/auth/auth.service.ts` | Modify | Change the POST endpoint in `refreshToken()` to `${this.base}/refresh`. |
| `src/app/core/interceptors/jwt.interceptor.ts` | Modify | Update URL inclusion check for `/auth/refresh` to just `/refresh` or the specific corrected endpoint. |

## Interfaces / Contracts

No new interfaces required. We are modifying existing private/public methods within `AuthService` and `JwtInterceptor`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Manual | 401 handling | Manually expire the local `access_token` and verify the next request triggers a successful, invisible refresh. |
| Integration | URL Construction | Verify the outgoing HTTP request for refresh uses the correct URL. |

## Migration / Rollout

No migration required. This is a purely client-side fix for an existing flawed interaction.

## Open Questions

None.
