# OpsFlow Production App

Expo / React Native app for production plans, orders, customers, and recipes.

## Setup

Use Node.js 22 LTS and pnpm 10.8.0 (declared in `package.json`).

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
```

Set `EXPO_PUBLIC_API_URL` in `.env.local` to your API's base URL. On a physical
device, use an address reachable from that device rather than `localhost`.
`EXPO_PUBLIC_` values are embedded in the client bundle; keep secrets on the server.

```sh
pnpm start
pnpm android
pnpm ios
```

The app currently uses Expo SDK 52. Use an SDK 52 compatible development build
or Expo Go client. iOS simulator and native iOS builds require macOS.
Upgrade Expo in a dedicated change with Android and iOS device checks following
the [Expo upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/).

## Checks

```sh
pnpm typecheck
pnpm test
pnpm exec expo install --check
pnpm exec expo export --platform android --platform ios
```

Tests cover query retries, mutation replay prevention, order cache invalidation,
asynchronously loaded dropdowns, selection resets, and form validation. They mock
network requests and native UI boundaries; native behavior still needs device testing.

API dates are stored as ISO strings. Forms convert dates to `Date` for the native
picker and serialize them when saving. Failed writes are not automatically retried:
check the refreshed server state before manually retrying an uncertain save.
