# quetzal API Documentation.

> All endpoints require authentication unless stated otherwise. Authentication is token-based — include the token in the `Authorization` header as `Token <token>`.
> 
 > BASE URL: http://127.0.0.1:8000/
 
---

## Authentication.

### Register.

`POST /auth/register/`

Create a new user account.

**Request body**

|Field|Type|Required|
|---|---|---|
|`username`|string|Yes|
|`display_name`|string|Yes|
|`password`|string (min 8 chars)|Yes|
|`main_currency`|string|Yes|

**Response** `201 Created`

```json
{
  "user": {
    "id": 3,
    "username": "janedoe",
    "display_name": "Jane Doe",
    "main_currency": "USD"
  },
  "token": "7248e..."
}
```

---

### Login.

`POST /auth/login/`

Authenticate and receive a token.

**Request body**

|Field|Type|Required|
|---|---|---|
|`username`|string|Yes|
|`password`|string|Yes|

**Response** `200 OK`

```json
{
  "user": {
    "id": 3,
    "username": "janedoe",
    "display_name": "Jane Doe",
    "main_currency": "USD"
  },
  "token": "7248e..."
}
```

**Errors**

- `400` — Bad Request

---

### Logout.

`POST /auth/logout/`

Invalidate the current token.

**Response** `200 OK`

---

## Users.

### List Users.

`GET /users/`

Returns all users. Public endpoint — no authentication required.

**Response** `200 OK`

```json
[
  {
    "id": 1,
    "username": "janedoe",
    "display_name": "Jane Doe",
    "main_currency": "USD"
  },
    {
    "id": 2,
    "username": "demo",
    "display_name": "Demo One",
    "main_currency": "ZAR"
  },
]
```

---

### Get Profile.

`GET /profile/`

Returns the authenticated user's profile.

**Response** `200 OK`

```json
{
  "id": 1,
  "username": "janedoe",
  "display_name": "Jane Doe",
  "main_currency": "USD"
}
```

---

### Update Profile.

`PUT /profile-update/`

Update the authenticated user's profile. All fields are optional.

**Request body**

|Field|Type|
|---|---|
|`username`|string|
|`display_name`|string|
|`main_currency`|string|

**Response** `200 OK`

---

### Delete Profile.

`DELETE /profile-delete/`

Delete the authenticated user's account.

**Response** `204 No Content`

---

### Change Password.

`PUT /change-password/<id>/`

Change the password for a user.

**Request body**

|Field|Type|Required|
|---|---|---|
|`old_password`|string (min 8 chars)|Yes|
|`new_password`|string (min 8 chars)|Yes|

**Response** `200 OK`

**Errors**

- `400` — Current password is incorrect
- `400` — New password must be different from current password
- `404` — User not found

---

## Accounts.

### List / Create Accounts.

`GET /accounts/` `POST /accounts/`

**GET** — Returns all accounts for the authenticated user.

**POST** — Create a new account.

**Request body (POST)**

|Field|Type|Required|
|---|---|---|
|`name`|string|Yes|
|`type`|string|Yes|
|`currency`|string|Yes|

**Response** `200 OK` / `201 Created`

```json
[
  {
	"id": 1,
    "name": "Savings",
    "type": "savings",
    "currency": "USD",
    "balance": "0.00",
    "user": 4
  }
]
```

---

### Get / Update / Delete Account.

`GET /accounts/<id>/` `PUT /accounts/<id>/` `DELETE /accounts/<id>/`

**DELETE** — Deletes the account and reverts all balance effects from its transactions. For transfers, linked transactions and their balance effects are also reversed.

**Response** `200 OK` / `204 No Content`

---

### Accounts Aggregate.

`GET /accounts/aggregate/`

Returns total balance across all accounts, converted to the user's main currency.

**Query parameters**

|Param|Description|
|---|---|
|`type`|Filter by account type|
|`currency`|Filter by currency code|

**Response** `200 OK`

```json
{
  "total_balance": 5000.00,
  "total_accounts": 3,
  "main_currency": "USD",
  "accounts_converted": 1
}
```

> Currency conversion uses the Frankfurter API. Falls back to cached date if the API is unavailable.

---

### Accounts Graph.

`GET /accounts/graph/`

Returns cumulative monthly net balance data for charting.

**Query parameters**

|Param|Description|
|---|---|
|`currency`|Filter by currency|
|`account`|Filter by account name|

**Response** `200 OK`

```json
{
  "transactions_by_month": {
    "2026-01": 1200.00,
    "2026-02": 2400.00
  },
  "converted_transactions": 2,
  "total_transactions": 10
}
```

---

## Categories.

### List / Create Categories.

`GET /categories/` `POST /categories/`

**Query parameters (GET)**

|Param|Description|
|---|---|
|`name`|Filter by name (partial match)|
|`type`|Filter by type|

**Response** `200 OK`

```json
{
  "id": 1,
  "name": "Food",
  "type": "expense",
  "user": 4
}
```

**Request body (POST)**

|Field|Type|Required|
|---|---|---|
|`name`|string|Yes|
|`type`|string|No|

**Response** `200 OK` / `201 Created`

```json
{
  "id": 3,
  "name": "Sports",
  "type": "expense",
  "user": 4
}
```

---

### Get / Update / Delete Category.

`GET /categories/<id>/` `PUT /categories/<id>/` `DELETE /categories/<id>/`

**DELETE** — Deletes the category and all associated transactions. Balance effects from those transactions are reversed.

---

### Categories Graph.

`GET /categories/graph/`

Returns transactions grouped by category, broken down by income, expenses, and transfers. Used for radar charts.

**Query parameters**

|Param|Description|
|---|---|
|`currency`|Filter by currency|
|`account`|Filter by account name|
|`start_date`|Start date (`YYYY-MM-DD`)|
|`end_date`|End date (`YYYY-MM-DD`)|
|`radar_check`|If set, returns previous month data instead of date range (for use with radar chart)|

**Response** `200 OK`

```json
{
  "transactions_by_category": {
    "income": {
      "Paycheck": 30000.0,
      "Dividends": 720.0,
      "Income": 26600.0
    },
    "expenses": {
      "Rent": -7001.72,
      "Fitness": -260.0,
      "Subscriptions": -231.12,
      "Shopping": -1212.21,
      "Food": -3835.18,
      "Recreation": -517.75,
      "Tax": -5200.0,
      "Transport": -1556.77,
      "Healthcare": -2262.3,
      "Utilities": -1159.25,
      "Education": -1600.0,
      "Entertainment": -14.98
    },
    "transfers": {}
  },
  "income_total": 57320.0,
  "expenses_total": -24851.28,
  "converted_transactions": 0,
  "total_transactions": 258
}
```

---

### Categories Chart.

`GET /categories/chart/`

Returns cumulative monthly transaction data for a specific category. Used for bar charts.

**Query parameters**

|Param|Description|
|---|---|
|`category`|Category ID|
|`currency`|Filter by currency|
|`category_converted_transactions`|`int` — if non-zero, performs currency conversion|

**Response** `200 OK`

```json
{
  "category_transactions_by_month": {
    "2026-02": -1092.84,
    "2026-03": -727.26,
    "2026-04": -1216.8,
    "2026-05": -798.28
  },
  "converted_transactions": 0,
  "total_transactions": 137
}
```

---

## Transactions.

### List / Create Transactions.

`GET /transactions/` `POST /transactions/`

**GET** — Returns all transactions for the authenticated user, ordered by datetime ascending.

**Query parameters (GET)**

|Param|Description|
|---|---|
|`start_date`|Filter from date (`YYYY-MM-DD`)|
|`end_date`|Filter to date (`YYYY-MM-DD`)|
|`account`|Filter by account name (exact)|
|`currency`|Filter by currency code|
|`category`|Filter by category name (partial match)|
|`transaction_type`|`income`, `expense`, or `transfer`|

**Request body (POST)**

|Field|Type|Required|Notes|
|---|---|---|---|
|`amount`|decimal|Yes|Must be > 0|
|`description`|string|Yes||
|`notes`|string|No||
|`datetime`|string|Yes|Format: `YYYY-MM-DD HH:MM`|
|`account_name`|string|Yes|Created if doesn't exist|
|`category_name`|string|Yes|Created if doesn't exist|
|`transaction_type`|string|Yes|`income`, `expense`, or `transfer`|
|`destination_account_name`|string|Required for transfers||
|`currency`|string|No|Inherited from account if omitted|

**Response** `201 Created`

```json
{
  "id": 1,
  "amount": "1654.32",
  "description": "Food Lovers Market",
  "notes": "Brackenfell",
  "datetime": "2026-01-15 14:30",
  "currency": "ZAR",
  "account": "Capitec",
  "destination_account": null,
  "category": "Food",
  "transaction_type": "expense",
  "linked_transaction": null
}
```

**Validation errors**

- `400` — Amount must be greater than 0
- `400` — Cannot transfer to the same account
- `400` — Cannot transfer between accounts with different currencies

---

### Recent Transactions.

`GET /transactions/recent/`

Returns the 10 most recent transactions ordered by datetime descending.

**Response** `200 OK` — Array of transaction objects.

---

### Get / Update / Delete Transaction.

`GET /transactions/<id>/` `PUT /transactions/<id>/` `DELETE /transactions/<id>/`

**PUT** — Updates the transaction and recalculates account balances accordingly.

**DELETE** — Deletes the transaction and reverts its balance effect. For transfers, the linked mirror transaction is also handled.

**Transfer update restrictions**

- Cannot change transaction type from income/expense to transfer
- Cannot change origin or destination account after transfer creation

---

### Transaction Aggregate.

`GET /transactions/aggregate/`

Returns income, expense, and net totals, with optional currency conversion to the user's main currency.

**Query parameters**

|Param|Description|
|---|---|
|`transaction_type`|`income` or `expense`|
|`currency`|Filter by currency|
|`category`|Filter by category name|
|`account`|Filter by account name|
|`start_date`|Start date (`YYYY-MM-DD`)|
|`end_date`|End date (`YYYY-MM-DD`)|

**Response** `200 OK`

```json
{
  "income": 3000.00,
  "expense": 800.00,
  "net": 2200.00,
  "transaction_count": 12,
  "transactions_converted": 2,
  "filters_applied": {}
}
```

---

### Export Transactions.

`GET /transactions/export/`

Downloads all transactions as a CSV file.

**Response** `200 OK` — `Content-Type: text/csv`

CSV columns: `Username`, `ID`, `Account`, `Destination Account`, `Datetime`, `Amount`, `Currency`, `Category`, `Description`, `Notes`, `Transaction Type`

---

### Spending Graph.

`GET /transactions/spending-graph/`

Returns cumulative daily expense totals for charting. Used for the dashboard spending graph.

**Query parameters**

|Param|Description|
|---|---|
|`start_date`|Start date (`YYYY-MM-DD`)|
|`end_date`|End date (`YYYY-MM-DD`)|
|`currency`|Filter by currency|
|`account`|Filter by account|

**Response** `200 OK`

```json
{
  "expenses_by_day": {
    "2025-01-01": 50.00,
    "2025-01-02": 120.00
  },
  "converted_transactions": 1,
  "total_transactions": 5
}
```

---

### Reset / Delete All Data.

`DELETE /transactions-delete/`

Permanently deletes all transactions, accounts, and categories for the authenticated user.

**Response** `200 OK`

```json
{
  "Deleted 10 transactions — Deleted 3 accounts — Deleted 5 Categories"
}
```

---

## Notes.

**Currency conversion** — Conversion uses the [Frankfurter API](https://www.frankfurter.dev/). If the API is unavailable, the last successfully fetched date is used as a fallback.

**Transfers** — Creating a transfer automatically creates a mirrored transaction on the destination account. Both transactions are linked via `linked_transaction`. Deleting or editing either side handles both.

**Balance tracking** — Account balances are updated automatically on transaction create, update, and delete.
