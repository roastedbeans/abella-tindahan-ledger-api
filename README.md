# Week 3 class API

The server students build in setup steps 2 to 5, as a runnable project.

## Run it

```
cd mobile-computing/class-api
npm install
npm run dev
```

Next prints two addresses. The phone needs the **Network** one, not Local, because on the
phone `localhost` means the phone.

```
- Local:    http://localhost:3000
- Network:  http://192.168.1.5:3000
```

Open `/` in a browser for the web pages: sign in at `/login`, then `/customers`.

Then in `my-app/.env`:

```
EXPO_PUBLIC_API_URL=http://192.168.1.5:3000
```

and restart Expo with `npm start -- --clear`.

## What students type in class

They do not copy this folder. Setup steps 2 to 5 build it from scratch:

```
npx create-next-app@latest mc2-api --ts --app --no-src-dir --no-tailwind --no-eslint
```

then `app/api/rows.ts`, `app/api/customers/route.ts`, and
`app/api/customers/[id]/route.ts`. This folder is the finished answer, for you to run
while presenting.

## Routes

| Request | Result |
|---|---|
| `/api/customers` | The three rows |
| `/api/customers/c1` | One row |
| `/api/customers/c9` | 404, no such id |
| `/api/customer` | 404, no such route |

The routes are static on purpose. Every screen state has a real cause instead of a
query switch:

| State | How to cause it |
|---|---|
| content | Open it |
| loading, then timeout | Point `EXPO_PUBLIC_API_URL` in `.env` at an address with nothing on it, e.g. `http://192.168.1.250:3000`. The connection hangs, and the app's own 8s timer wins the race |
| no connection | Airplane mode on the phone |
| 404 | Ask for `/api/customer` or an unknown id |
| empty | Empty the array in `app/api/rows.ts` and save |

Verified on Next.js 16.3.5: the four routes return the statuses above, a dead address
hangs past the client's 8s timer, and `tsc --noEmit` is clean.

## When the phone cannot reach the laptop

USB with `--localhost` forwards only Metro's port. School Wi-Fi often blocks device to
device. In either case deploy instead, and change only `BASE` in the app:

```
npx vercel
```

## Adding a team's topic

Add an array to `app/api/rows.ts` and a folder beside `customers/`. Three rows is enough.
Keep `id` and `name`.

## Note on http

The Network address is plain `http://`. Expo Go and development builds allow that. A store
build would not, which is one reason Week 11 to 13 moves to a deployed HTTPS address.

## Web pages

Enterprise Programming 2, Week 5 adds pages on top of the API, on the `feature/web-layout` branch. The phone app's routes are unchanged.

| Page | Who | Shows |
|---|---|---|
| `/login` | anyone | Sign in, or create a client account |
| `/customers` | signed in | The customers and what each owes. The admin also gets the form to add one |
| `/customers/c1` | signed in | One customer's dues and payments. The admin also gets the form to record one |

## Demo accounts

Sign in at `/login`, or send the account's token to a route. These are test accounts in Supabase Auth; the role of each is in the `profiles` table. The admin is the store owner; a client is a customer.

| Role | Email | Password | Can do |
|---|---|---|---|
| admin | `admin@tindahan.test` | `tindahan-admin` | See customers, add a customer, add dues and payments |
| client | `client@tindahan.test` | `tindahan-client` | See customers and their dues and payments |

Anyone can create an account on the login page, and it is always a `client`. There is exactly one admin: the database refuses a second `profiles` row with the role `admin`.

## API contract, version 1

Every route answers `401` when it does not know the user. Send the session cookie (browser) or `Authorization: Bearer <access token>` (the phone app, or another team's app).

| Method | Route | Who | Body | Answers |
|---|---|---|---|---|
| GET | `/api/me` | signed in | | `200` `{ id, email, role }` |
| GET | `/api/customers` | signed in | | `200` list of `{ id, name, balance, lastPaid }` |
| POST | `/api/customers` | admin | `{ name, balance }` | `201` the new customer, `400` `{ message }`, `403` |
| GET | `/api/customers/:id` | signed in | | `200` one customer, `404` |
| GET | `/api/customers/:id/entries` | signed in | | `200` list of `{ id, customerId, kind, amount, createdAt }` |
| POST | `/api/customers/:id/entries` | admin | `{ kind: "due" or "payment", amount }` | `201` the new entry, `400` `{ message }`, `403`, `404` |
