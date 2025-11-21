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

The app uses a centralized authentication system with environment-based configuration:

1. **[lib/appwrite.ts:66-234](lib/appwrite.ts#L66-L234)** - `createAppWriteService()` factory function that:
   - Initializes AppWrite client and database connections
   - Provides auth methods: `registerWithEmail()`, `loginWithEmail()`, `getCurrentUser()`, `logoutCurrentDevice()`
   - Provides database methods: `getMemberByUserId()`, `createMemberForUser()`, `ensureMemberForUser()`, `updateMember()`, `getMembers()`
   - Returns a service object with all methods
   - Registration automatically creates member database record with email, phone, and club

2. **[hooks/AuthContext.tsx:38-200](hooks/AuthContext.tsx#L38-L200)** - React Context wrapper:
   - Wraps the AppWrite service in a React Context for app-wide access
   - Maintains auth state: `user` (AppWrite user), `member` (database row), `loading`, `error`
   - Exposes methods: `login()`, `register()`, `logout()`, `refresh()`, `updateMember()`
   - Auto-loads auth state on mount via `loadAuthState()`
   - Use the `useAuth()` hook to access auth context in components

3. **AppWrite Configuration ([lib/appwrite.ts:13-36](lib/appwrite.ts#L13-L36))**:
   - All config loaded from environment variables with `EXPO_PUBLIC_` prefix
   - Required vars: `EXPO_PUBLIC_APPWRITE_ENDPOINT`, `EXPO_PUBLIC_APPWRITE_PROJECT_ID`, `EXPO_PUBLIC_APPWRITE_PLATFORM`, `EXPO_PUBLIC_APPWRITE_DATABASE_ID`, `EXPO_PUBLIC_APPWRITE_MEMBERS_TABLE_ID`
   - Copy [.env.example](.env.example) to `.env` and fill in your credentials
   - Fails fast with error if any required environment variables are missing

### Data Model

**MemberRow** ([lib/appwrite.ts:38-45](lib/appwrite.ts#L38-L45)) - Database schema for members:

- `firstName`, `lastName`, `userID` (required)
- `club`, `phone`, `email` (optional)

When users register, a member row is automatically created in the database.

### Routing Structure

Expo Router file-based routing under [app/](app/):

- [app/(tabs)/](app/(tabs)/) - Tab-based layout (bottom tab navigation)
  - [_layout.tsx](app/(tabs)/_layout.tsx) - Configures tab navigation
  - [index.tsx](app/(tabs)/index.tsx) - Home/first tab
  - [auth.tsx](app/(tabs)/auth.tsx) - Authentication screen (login/register)
  - [two.tsx](app/(tabs)/two.tsx) - Second tab screen
- [app/_layout.tsx](app/_layout.tsx) - Root layout wrapper (wraps app with AuthProvider)
- [app/modal.tsx](app/modal.tsx) - Modal screen example
- [app/+not-found.tsx](app/+not-found.tsx) - 404 handler

## Important Notes

### Environment & Secrets

- Copy [.env.example](.env.example) to `.env` and configure your AppWrite credentials
- All environment variables must use `EXPO_PUBLIC_` prefix to be accessible in React Native
- `.env*` files (except `.env.example`) are git-ignored - never commit credentials
- [.gitignore](.gitignore) blocks native build artifacts (`/ios`, `/android`, `/dist`, `/web-build`) and local env files

### TypeScript Configuration

- Strict mode enabled ([tsconfig.json](tsconfig.json))
- Path alias: `@/*` maps to root directory (use `@/lib/appwrite` instead of relative paths)
- Targets Expo types automatically

### Platform-Specific Considerations

- **iOS**: Tablet support enabled
- **Android**: Edge-to-edge layout enabled, predictive back gesture disabled
- **Web**: Metro bundler, static output
- Responsive components should account for portrait orientation (default)
- New Architecture enabled ([app.json](app.json): `newArchEnabled: true`)

## Common Tasks

**Adding a new screen:**

1. Create file in [app/(tabs)/](app/(tabs)/) or [app/](app/) as appropriate
2. Use Expo Router automatic routing (file path = route)
3. Wrap with `useAuth()` if auth-protected

**Using auth in components:**

```tsx
import { useAuth } from "@/hooks/AuthContext";

export function MyComponent() {
  const { user, member, login, logout, error } = useAuth();
  // ...
}
```

**Querying/updating member data:**

- Use `useAuth().member` for current user's member data
- Use `updateMember()` from auth context to save changes
- Direct database queries use `appwriteService.tables.listRows()` / `.getRow()` / `.updateRow()`
- Use `getMembers(club)` to fetch all members for a specific club

**Multi-platform testing:**

Thoroughly test on all three platforms (iOS simulator, Android emulator, web) since UI behavior differs by platform.
