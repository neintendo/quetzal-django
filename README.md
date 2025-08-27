# Quetzal Finance Manager API.

A personal finance management system API for tracking finances across multiple user accounts (e.g., bank, cash, or investment). The system allows users to manage transactions, categorize expenses, and visualize financial data, with built-in authentication and support for multiple users

## ✨ Features.

- **🔐 Secure Authentication** - Token-based user authentication with registration/login/logout.
- **💼 Multi-Account Management** - Support for bank, cash, investment, savings, credit, and loan accounts
- **📊 Transaction Tracking** - Record income, expenses, and transfers between accounts.
- **🏷️ Smart Categorization** - Customizable categories for all transaction types.
- **🌍 Multi-Currency Support** - Track finances in over 150 currencies with consistent conversion (auto-conversion feature to be implemented).
- **⏰ Date Filtering** - Filter transactions by specific date ranges.
- **📈 Financial Analytics** - Aggregate views of income, expenses, and net worth.
- **👥 Multi-User Support** - Each user has completely isolated financial data.

## 🛠 Tech Stack.

- **Backend Framework**: Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Token-based authentication
- **Filtering**: Django Filter for advanced query capabilities


## 📜 API Documentation.

### Authentication Endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register/` | Register a new user |
| POST | `/auth/login/` | Login and receive authentication token |
| POST | `/auth/logout/` | Logout and invalidate token |

### Account Management.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounts/` | List all user accounts |
| POST | `/accounts/` | Create a new account |
| GET | `/accounts/{id}/` | Retrieve specific account details |
| PUT | `/accounts/{id}/` | Update account information |
| DELETE | `/accounts/{id}/` | Delete an account |

### Transaction Operations.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions/` | List all transactions with filtering |
| POST | `/transactions/` | Create a new transaction |
| GET | `/transactions/{id}/` | Retrieve specific transaction |
| PUT | `/transactions/{id}/` | Update a transaction |
| DELETE | `/transactions/{id}/` | Delete a transaction |
| GET | `/transactions/aggregate/` | Get financial aggregates with filters |

### Category Management.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories/` | List all categories |
| POST | `/categories/` | Create a new category |
| GET | `/categories/{id}/` | Retrieve specific category |
| PUT | `/categories/{id}/` | Update a category |
| DELETE | `/categories/{id}/` | Delete a category |

## 🏗 Project Structure.

```
quetzal_app/
├── authentication.py    # Authentication views
├── models.py           # Database models (User, Account, Category, Transaction)
├── serializers.py      # DRF serializers
├── views.py           # API views
├── urls.py           # URL routing
└── admin.py          # Django admin configuration
```

## 🔮 Upcoming Features.

- [ ] Currency conversion to match the recepient account.
- [ ] Exchange rate API integration.
- [ ] Recurring transactions.
- [ ] Data visualization dashboard
- [ ] Desktop application frontend