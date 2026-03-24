from django.urls import path

from .authentication import UserLoginView, UserLogoutView, UserRegistrationView
from .views import (
    AccountDetailView,
    AccountsAggregateView,
    AccountsListCreateView,
    AccountsGraphView,
    CategoriesDetailView,
    CategoriesListCreateView,
    TransactionAggregateView,
    TransactionDetailView,
    TransactionListCreateView,
    UserProfileView,
)

urlpatterns = [
    # Authentication
    path("auth/register/", UserRegistrationView.as_view(), name="register"),
    path("auth/login/", UserLoginView.as_view(), name="login"),
    path("auth/logout/", UserLogoutView.as_view(), name="logout"),
    # User Profile
    path("profile/", UserProfileView.as_view(), name="profile"),
    # Accounts
    path("accounts/", AccountsListCreateView.as_view(), name="account-list-create"),
    path("accounts/<int:pk>/", AccountDetailView.as_view(), name="account-detail"),
    path(
        "accounts/aggregate/",
        AccountsAggregateView.as_view(),
        name="accounts-aggregate",
    ),
    path("accounts/graph/", AccountsGraphView.as_view(), name="accounts-graph"),

    # Categories
    path(
        "categories/", CategoriesListCreateView.as_view(), name="category-list-create"
    ),
    path(
        "categories/<int:pk>/", CategoriesDetailView.as_view(), name="category-detail"
    ),
    # Transactions
    path(
        "transactions/",
        TransactionListCreateView.as_view(),
        name="transaction-list-create",
    ),
    path(
        "transactions/<int:pk>/",
        TransactionDetailView.as_view(),
        name="transaction-detail",
    ),
    path(
        "transactions/aggregate/",
        TransactionAggregateView.as_view(),
        name="transaction-aggregate",
    ),
]
