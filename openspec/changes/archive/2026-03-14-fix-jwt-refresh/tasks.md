# Tasks: Fix JWT Refresh

## Phase 1: Core Implementation (Fix Bug)

- [x] 1.1 Correct URL in `src/app/core/auth/auth.service.ts`
  - Change `refreshToken()` POST path from `${this.base}/auth/refresh` to `${this.base}/refresh`.
- [x] 1.2 Update exclusion filters in `src/app/core/interceptors/jwt.interceptor.ts`
  - Update `!req.url.includes('/auth/refresh')` to `!req.url.includes('/refresh')`.
- [x] 1.3 Verify `isRefreshing` flow in interceptor
  - Ensure the `BehaviorSubject` correctly pause and replay multiple concurrent 401 requests.

## Phase 2: Testing / Verification

- [x] 2.1 Manual Test: Successful Token Refresh
  - GIVEN an expired access token
  - WHEN a protected HTTP request is made
  - THEN verify the POST to `/api/auth/refresh` succeeds and the original request is replayed.
- [x] 2.2 Manual Test: Failed Token Refresh (Logout)
  - GIVEN an invalid refresh token
  - WHEN a refresh is attempted
  - THEN verify the user is redirected to `/auth/login`.
- [x] 2.3 Verify Consol Logs
  - Ensure no 404 errors appear for `/auth/refresh` during the flow.

## Phase 3: Documentation & Cleanup

- [x] 3.1 Update `walkthrough.md` with results
- [x] 3.2 Remove any temporary logging or debug code used during implementation.
