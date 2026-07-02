# Firestore Security Rules Specification

This document defines the security specifications, data invariants, and adversarial "Dirty Dozen" payloads designed to test and secure the application's Firestore database.

## 1. Data Invariants
- **User Profile**: A user profile document can only be read or written by the authenticated owner (`request.auth.uid == userId`). The email verified status should be verified if standard login is required, but since we support Google SSO and user sign-in, we enforce that `request.auth.uid != null`.
- **Favorite Groups**: Favorite groups are owned by individual users. A user can only read, create, update, or delete favorite groups within their own path (`/users/{userId}/favoriteGroups/{groupId}`).
- **Orders**: Orders must be saved with `userId` matching `request.auth.uid` or must belong to the user's logged-in email, and can only be queried if `resource.data.userId == request.auth.uid` or if the user is an admin.
- **Products**: Anyone can read products. Only authorized users can write or update products.

---

## 2. The "Dirty Dozen" Hostile Payloads
The following payloads attempt to exploit access gaps, bypass validation, or hijack identity, and must be rejected (`PERMISSION_DENIED`).

1. **Identity Spoofing in Profiles**: Authenticated user `user-abc` tries to write a profile document under `users/user-xyz`.
2. **PII Leakage Query**: Unauthenticated request trying to read `/users/some-user-id` to scrape their profile or email.
3. **Admin Privilege Escalation**: User `user-abc` tries to set `"isAdmin": true` or `"role": "admin"` on their profile document.
4. **Favorite Group Hijack**: User `user-abc` tries to write to `/users/user-xyz/favoriteGroups/group-123` to manipulate another user's favorite folder.
5. **Orphaned Product Id Injection**: Writing a favorite group with invalid/malicious characters in its ID (ID poisoning).
6. **Denial of Wallet payload**: Injecting a 2MB string as the name of a favorite group folder to exhaust storage quota.
7. **Order Spoofing**: User `user-abc` places an order with `userId` set to `user-xyz` to charge/assign it to another account.
8. **Malicious Price Manipulation**: An authenticated standard user tries to update a product's price (`products/jacket-123`) to `0.01` in the database.
9. **Invalid Order Status Injection**: An authenticated user tries to directly change their order status from `pending` to `delivered` via client-side update.
10. **Shadow Field injection**: Attempting to add a custom hidden field like `bypassSecurityRules: true` on an order or product create.
11. **Spoofed Timestamps**: Creating an order with a pre-dated client timestamp `createdAt: "1970-01-01"` instead of using the server-side `request.time`.
12. **Unbounded List Injection**: Attempting to save a favorite group containing an array with 10,000 dummy product IDs to crash the UI render and exhaust database bandwidth.

---

## 3. The Test Plan (firestore.rules.test.ts)
A mock test runner structure to assert all the above rules:
- Verify that reading another user's profile returns permission denied.
- Verify that writing a product requires admin privileges/authorization.
- Verify that favorite groups can only be read and written by the owning `userId`.
- Verify that order status cannot be mutated arbitrarily by the customer.
