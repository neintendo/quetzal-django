from django.urls import path

from .authentication import UserLoginView, UserLogoutView, UserRegistrationView
from .views import (
    AccountDetailView,
    AccountsAggregateView,
    AccountsGraphView,
    AccountsListCreateView,
    CategoriesChartView,
    CategoriesDetailView,
    CategoriesGraphView,
    CategoriesListCreateView,
    TransactionAggregateView,
    TransactionDetailView,
    TransactionListCreateView,
    UserDetailView,
    UserListCreateView,
    UserProfileView,
)

urlpatterns = [
    # Authentication
    path("auth/register/", UserRegistrationView.as_view(), name="register"),
    path("auth/login/", UserLoginView.as_view(), name="login"),
    path("auth/logout/", UserLogoutView.as_view(), name="logout"),
    # Users
    path("users/", UserListCreateView.as_view(), name="users"),
    # User Profile
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("profile-update/", UserProfileView.as_view(), name="profile-update"),
    path("profile-delete/", UserDetailView.as_view(), name="profile-delete"),
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
    path("categories/graph/", CategoriesGraphView.as_view(), name="category-graph"),
    path("categories/chart/", CategoriesChartView.as_view(), name="category-chart"),
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
