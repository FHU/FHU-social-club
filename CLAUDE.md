# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FHU Social Club** is a cross-platform mobile application built with Expo and React Native. It supports iOS, Android, and web platforms from a single codebase. The app includes user authentication and a member management database powered by AppWrite (a Firebase-like backend-as-a-service platform).

**Tech Stack:**
- Expo ~54.0.13 with Expo Router for navigation
- React 19.1.0 / React Native 0.81.4
- TypeScript (strict mode)
- AppWrite for authentication and database
- React Navigation 7.1.8

## Development Commands

```bash
# Start the development server (interactive menu to choose platform)
npm start

# Start with iOS simulator
npm run ios

# Start with Android emulator
npm run android

# Start with web browser
npm run web
```

No test command is currently configured. Add testing utilities (Jest, Vitest, testing-library) before running tests.

## Architecture

### Authentication Flow (AppWrite)

The app uses a centralized authentication system:

1. **`lib/appwrite.ts:47-200`** - `createAppWriteService()` factory function that:
   - Initializes AppWrite client and database connections
   - Provides auth methods: `registerWithEmail()`, `loginWithEmail()`, `getCurrentUser()`, `logoutCurrentDevice()`
   - Provides database methods for member management: `getMemberByUserId()`, `createMemberForUser()`, `ensureMemberForUser()`, `updateMember()`
   - Returns a service object with all methods

2. **`hooks/AuthContext.tsx:31-154`** - React Context wrapper:
   - Wraps the AppWrite service in a React Context for app-wide access
   - Maintains auth state: `user` (AppWrite user), `member` (database row), `loading`
   - Exposes methods: `login()`, `register()`, `logout()`, `refresh()`, `updateMember()`
   - Auto-loads auth state on mount via `loadAuthState()`
   - Use the `useAuth()` hook to access auth context in components

3. **AppWrite Configuration (`lib/appwrite.ts:11-17`)**:
   - Endpoint: `https://nyc.cloud.appwrite.io/v1`
   - Project ID: `68f8ec97000725d9392c`
   - Database ID: `6908d1c3003443e7093d`
   - Members Table: `members`
   - Platform: `edu.fhu.fhusocialclub` (required for React Native)

### Data Model

**MemberRow** (`lib/appwrite.ts:19-26`) - Database schema for members:
- `firstName`, `lastName`, `userID` (required)
- `club`, `phone`, `email` (optional)

When users register, a member row is automatically created in the database.

### Routing Structure

Expo Router file-based routing under `app/`:
- `app/(tabs)/` - Tab-based layout (bottom tab navigation)
  - `_layout.tsx` - Configures tab navigation
  - `index.tsx` - Home/first tab
  - `auth.tsx` - Authentication screen (login/register)
  - `two.tsx` - Second tab screen
- `app/_layout.tsx` - Root layout wrapper
- `app/modal.tsx` - Modal screen example
- `app/+not-found.tsx` - 404 handler

## Important Notes

### Environment & Secrets

- `.env*` files are git-ignored (don't commit)
- AppWrite credentials are currently hardcoded in `lib/appwrite.ts` (credentials visible in code - add environment variables for production)
- `.gitignore` blocks native build artifacts (`/ios`, `/android`, `/dist`, `/web-build`) and credentials files

### Current Development State

- Branch: `members-db` (feature branch for auth/database integration)
- Recently added: AppWrite auth service, AuthContext provider, member database integration
- 4 modified files awaiting commit
- Sample data: `sample_people_50_v4_with_id.json` suggests member listing features in development

### TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to root directory (use `@/lib/appwrite` instead of relative paths)
- Targets Expo types automatically

### Platform-Specific Considerations

- **iOS**: Tablet support enabled
- **Android**: Edge-to-edge layout enabled, predictive back gesture disabled
- **Web**: Metro bundler, static output
- Responsive components should account for portrait orientation (default)

## Common Tasks

**Adding a new screen:**
1. Create file in `app/(tabs)/` or `app/` as appropriate
2. Use Expo Router automatic routing (file path = route)
3. Wrap with `useAuth()` if auth-protected

**Using auth in components:**
```tsx
import { useAuth } from "@/hooks/AuthContext";

export function MyComponent() {
  const { user, member, login, logout } = useAuth();
  // ...
}
```

**Querying/updating member data:**
- Use `useAuth().member` for current user's member data
- Use `updateMember()` from auth context to save changes
- Direct database queries use `appwriteService.tables.listRows()` / `.getRow()` / `.updateRow()`

**Multi-platform testing:**
Thoroughly test on all three platforms (iOS simulator, Android emulator, web) since UI behavior differs by platform.
