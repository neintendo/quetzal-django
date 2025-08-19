from django.urls import path
from .views import AccountsListCreateView, AccountDetailView, CategoriesListCreateView, CategoriesDetailView, TransactionListCreateView, TransactionDetailView

urlpatterns = [
    # Accounts
    path("accounts/", AccountsListCreateView.as_view(), name="account-list-create"),
    path("accounts/<int:pk>/", AccountDetailView.as_view(), name="account-detail"),

    # Categories
    path("categories/", CategoriesListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", CategoriesDetailView.as_view(), name="category-detail"),

    # Transactions
    path("transactions/", TransactionListCreateView.as_view(), name="transaction-list-create"),
    path("transactions/<int:pk>/", TransactionDetailView.as_view(), name="transaction-detail"),
]