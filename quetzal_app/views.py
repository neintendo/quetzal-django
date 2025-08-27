from unicodedata import category

from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Account, Category, Transaction
from .serializers import UserSerializer, AccountSerializer, CategorySerializer, TransactionSerializer
from django.db import transaction as db_transaction
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Sum

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

# Class for transaction filtering.
class TransactionFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='datetime', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='datetime', lookup_expr='lte')
    account = django_filters.CharFilter(method='filter_account')
    category = django_filters.CharFilter(field_name='category__name', lookup_expr='icontains')

    class Meta:
        model = Transaction
        fields = ['transaction_type']

    def filter_account(self, queryset, value):
        return queryset.filter(
            Q(account__name__icontains=value) |
            Q(destination_account__name__icontains=value)
        )
# Transactions
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TransactionFilter

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('datetime')

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
            account.save()
        elif transaction.transaction_type == 'expense':
            account.balance -= transaction.amount
            account.save()            
        elif transaction.transaction_type == 'transfer':
            # Deducts from the origin account and adds to destination account
            if transaction.account and transaction.destination_account:
                transaction.account.balance -= transaction.amount
                transaction.destination_account.balance += transaction.amount
                transaction.account.save()
                transaction.destination_account.save()

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
        elif old_category_type == 'transfer':
            old_transaction.account.balance += old_amount
            old_transaction.destination_account.balance -= old_amount
            old_transaction.account.save()
            old_transaction.destination_account.save()
        account.save()

        # Saves the updated transaction
        updated_transaction = serializer.save()
        new_type = updated_transaction.transaction_type
        new_amount = updated_transaction.amount

        # Apply the new transaction's effect
        if new_type == 'income':
            updated_transaction.account.balance += new_amount
            updated_transaction.account.save()
        elif new_type == 'expense':
            updated_transaction.account.balance -= new_amount
            updated_transaction.account.save()
        elif new_type == 'transfer':
            updated_transaction.account.balance -= new_amount
            updated_transaction.destination_account.balance += new_amount
            updated_transaction.account.save()
            updated_transaction.destination_account.save()
        account.save()

    @db_transaction.atomic
    def perform_destroy(self, instance):
        # Revert the transaction's effect on account balance
        account = instance.account

        if instance.transaction_type == 'income':
            account.balance -= instance.amount
        elif instance.transaction_type == 'expense':
            account.balance += instance.amount
        elif instance.transaction_type == 'transfer':
            instance.account.balance += instance.amount
            instance.destination_account.balance -= instance.amount
            instance.account.save()
            instance.destination_account.save()
        account.save()
        instance.delete()

class TransactionAggregateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # All user transactions.
        transactions = Transaction.objects.filter(user=request.user)

        # Filtered transactions.
        transactions_type = request.GET.get('transaction_type')
        if transactions_type:
            transactions = transactions.filter(transaction_type=transactions_type)

        category = request.GET.get('category')
        if category:
            transactions = transactions.filter(category__name__icontains=category)

        account = request.GET.get('account')
        if account:
            transactions = transactions.filter(
                Q(account__name__icontains=account) |
                Q(destination_account__name__icontains=account)
            )

        start_date = request.GET.get('start_date')
        if start_date:
            transactions = transactions.filter(datetime__date__gte=start_date)

        end_date = request.GET.get('end_date')
        if end_date:
            transactions = transactions.filter(datetime__date__lte=end_date)

        income_expense_transactions = transactions.exclude(transaction_type='transfer')

        # Calculate expenses, income & net worth (EXCLUDING transfers)
        income = income_expense_transactions.filter(transaction_type='income').aggregate(total=Sum('amount'))['total'] or 0
        expenses = income_expense_transactions.filter(transaction_type='expense').aggregate(total=Sum('amount'))['total'] or 0
        net = income - expenses

        return Response({
            'income': float(income),
            'expense': float(expenses),
            'net': float(net),
            'transaction_count': transactions.count(),
            'filters_applied': dict(request.GET)
        })