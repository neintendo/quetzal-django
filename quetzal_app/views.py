from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Account, Category, Transaction
from .serializers import UserSerializer, AccountSerializer, CategorySerializer, TransactionSerializer
from django.db import transaction as db_transaction

# Users
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Accounts
class AccountsListCreateView(generics.ListCreateAPIView):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

# Categories
class CategoriesListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoriesDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

# Transactions
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        # Pass the request to the serializer context
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @db_transaction.atomic
    def perform_create(self, serializer):
        # Save the transaction with the user
        transaction = serializer.save()

        # Updates the account balance.
        account = transaction.account
        if transaction.transaction_type == 'income':
            account.balance += transaction.amount
        elif transaction.transaction_type == 'expense':
            account.balance -= transaction.amount
        account.save()
        # Will add block for transfers later :)

class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    @db_transaction.atomic
    def perform_update(self, serializer):
        old_transaction = self.get_object()
        old_amount = old_transaction.amount
        old_category_type = old_transaction.transaction_type

        # Reverts the old transaction's effect
        account = old_transaction.account
        if old_category_type == 'income':
            account.balance -= old_amount
        elif old_category_type == 'expense':
            account.balance += old_amount
        account.save()

        # Saves the updated transaction
        updated_transaction = serializer.save()

        # Apply the new transaction's effect
        if updated_transaction.transaction_type == 'income':
            account.balance += updated_transaction.amount
        elif updated_transaction.transaction_type == 'expense':
            account.balance -= updated_transaction.amount
        account.save()

    @db_transaction.atomic
    def perform_destroy(self, instance):
        # Revert the transaction's effect on account balance
        account = instance.account

        if instance.transaction_type == 'income':
            account.balance -= instance.amount
        elif instance.transaction_type == 'expense':
            account.balance += instance.amount
        account.save()
        instance.delete()