from django.urls import path
from .views import UserProfileView, AccountsListCreateView, AccountDetailView, CategoriesListCreateView, CategoriesDetailView, TransactionListCreateView, TransactionDetailView, TransactionAggregateView
from .authentication import UserRegistrationView, UserLoginView, UserLogoutView

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

    # Categories
    path("categories/", CategoriesListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", CategoriesDetailView.as_view(), name="category-detail"),

    # Transactions
    path("transactions/", TransactionListCreateView.as_view(), name="transaction-list-create"),
    path("transactions/<int:pk>/", TransactionDetailView.as_view(), name="transaction-detail"),
    path("transactions/aggregate/", TransactionAggregateView.as_view(), name="transaction-aggregate"),
]