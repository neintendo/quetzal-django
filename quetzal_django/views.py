from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal

import django_filters
import requests
from django.db import transaction as db_transaction
from django.db.models import Q, Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Account, Category, Transaction, User
from .serializers import (
    AccountSerializer,
    CategorySerializer,
    TransactionSerializer,
    UserSerializer,
)
from .utilities.currency_conv import conversion


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


class UserListCreateView(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return User.objects.all()


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

    def perform_destroy(self, instance):

        instance_transactions = Transaction.objects.filter(account=instance)
        linked_acc = None

        for transaction in instance_transactions:
            if transaction.transaction_type == "transfer":
                try:
                    isMirror = False
                    if (transaction.destination_account) is None:
                        raise Exception

                except Exception:
                    isMirror = True
                    try:
                        linked_acc = Account.objects.get(
                            id=transaction.linked_transaction.account.id
                        )
                    except Exception as e:
                        linked_acc = None
                        print(e)

                if isMirror is False:
                    transaction.destination_account.balance -= transaction.amount
                    transaction.destination_account.save()
                    Transaction.objects.filter(
                        id=transaction.linked_transaction.id
                    ).delete()
                elif isMirror is True:
                    if linked_acc is not None:
                        linked_acc.balance += transaction.amount
                        linked_acc.save()
                        Transaction.objects.filter(
                            id=transaction.linked_transaction.id
                        ).delete()

        instance.delete()


class AccountsAggregateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # All user accounts
        accounts = Account.objects.filter(user=request.user)
        # User's main currency
        main_currency = getattr(request.user, "main_currency", "USD")

        # Filter by account type
        account_type = request.GET.get("type")
        if account_type:
            accounts = accounts.filter(type=account_type)

        # Filter by currency
        currency = request.GET.get("currency")
        if currency:
            accounts = accounts.filter(currency=currency.upper())

        # Creates a new array with converted balances
        converted_balances = []
        date_obj = datetime.now(timezone.utc)
        print("DATE", date_obj)
        accounts_converted = 0

        # Checks if API is working. If not, date_cmp = last saved date
        try:
            url = (
                "https://api.frankfurter.dev/v1/"
                + date_obj.strftime("%Y-%m-%d")
                + "?base="
                + main_currency.upper()
            )
            response = requests.get(url)
            print("STATUS CODE:", response.status_code)

        except Exception as e:
            try:
                with open("quetzal_django/utilities/date_obj.txt", "r") as date_cmp:
                    date_obj = datetime.strptime(date_cmp.read(), "%Y-%m-%d")

            except Exception as read_err:
                print("FILE ERROR", read_err)
                return
            print(e)

        for account in accounts:
            if account.currency != main_currency:
                balance = conversion(
                    account.balance, account.currency, main_currency, date_obj
                )
                converted_balances.append(balance)
                accounts_converted += 1
            else:
                converted_balances.append(float(account.balance))

        total_balance = 0
        for balance in converted_balances:
            total_balance += balance

        total_accounts = accounts.count()

        # On success, saves the current date for cache reference
        try:
            with open("quetzal_django/utilities/date_obj.txt", "w") as date_cmp:
                date_cmp.write(date_obj.strftime("%Y-%m-%d"))

        except Exception as read_err:
            print("FILE ERROR", read_err)
            return

        return Response(
            {
                "total_balance": round(total_balance, 2),
                "total_accounts": total_accounts,
                "main_currency": main_currency,
                "accounts_converted": accounts_converted,
            }
        )


class AccountsGraphView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # All user transactions.
        transactions = Transaction.objects.filter(user=request.user)

        # Filters request by currency
        currency = request.GET.get("currency")
        print("Currency:", currency)
        if currency:
            transactions = transactions.filter(currency=currency)

        # Filters request by account
        account = request.GET.get("account")
        print("Account:", account)
        if account:
            transactions = transactions.filter(account=account)

        # User's main currency
        main_currency = getattr(request.user, "main_currency", "USD")

        monthly_data = defaultdict(Decimal)
        converted_transactions = 0
        total_t = 0

        # Graph conversion for all currencies
        if (currency is None or currency == "") and (account is None or account == ""):
            for transaction in transactions:
                month_key = transaction.datetime.strftime("%Y-%m")
                amount = transaction.amount

                # For non main_currency conversions only
                if transaction.currency != main_currency and transaction.amount != 0:
                    converted_amount = conversion(
                        transaction.amount,
                        transaction.currency,
                        main_currency,
                        transaction.datetime,
                    )
                    converted_transactions += 1
                    amount = Decimal(str(converted_amount))

                match transaction.transaction_type:
                    case "income":
                        monthly_data[month_key] += amount
                        total_t += 1
                    case "expense":
                        monthly_data[month_key] -= amount
                        total_t += 1
                    case "transfer":
                        if (
                            transaction.destination_account is None
                            and transaction.linked_transaction is not None
                        ):
                            monthly_data[month_key] += amount
                        elif (
                            transaction.destination_account is not None
                            and transaction.linked_transaction is not None
                        ):
                            monthly_data[month_key] -= amount

        # No graph conversions for a single currency
        else:
            for transaction in transactions:
                month_key = transaction.datetime.strftime("%Y-%m")
                amount = transaction.amount

                match transaction.transaction_type:
                    case "income":
                        monthly_data[month_key] += amount
                        total_t += 1
                    case "expense":
                        monthly_data[month_key] -= amount
                        total_t += 1
                    case "transfer":
                        if (
                            transaction.destination_account is None
                            and transaction.linked_transaction is not None
                        ):
                            monthly_data[month_key] += amount
                        elif (
                            transaction.destination_account is not None
                            and transaction.linked_transaction is not None
                        ):
                            monthly_data[month_key] -= amount

        list_month = []
        for count in monthly_data:
            list_month.append(count)

        values = list(monthly_data.values())

        cumulative = []
        cumulative_total = 0
        for value in values:
            cumulative_total += value
            cumulative.append(cumulative_total)

        print(cumulative)

        c = 0
        for month in monthly_data:
            monthly_data[month] = cumulative[c]
            c += 1

        return Response(
            {
                "transactions_by_month": monthly_data,
                "converted_transactions": converted_transactions,
                "total_transctions": total_t,
            }
        )


# Categories
class CategoriesListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        categories = Category.objects.filter(user=self.request.user)

        # Filter by name
        name = self.request.GET.get("name")
        if name:
            categories = categories.filter(name__icontains=name)

        # Filter by type
        category_type = self.request.GET.get("type")
        if category_type:
            categories = categories.filter(type=category_type)

        return categories

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoriesDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


# Class for transaction filtering.
class TransactionFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="datetime", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="datetime", lookup_expr="lte")
    account = django_filters.CharFilter(field_name="account__name", lookup_expr="exact")
    currency = django_filters.CharFilter(field_name="currency", lookup_expr="exact")
    category = django_filters.CharFilter(
        field_name="category__name", lookup_expr="icontains"
    )

    class Meta:
        model = Transaction
        fields = ["transaction_type"]

    def filter_account(self, queryset, value):
        return queryset.filter(
            Q(account__name__icontains=value)
            | Q(destination_account__name__icontains=value)
        )


# Transactions
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TransactionFilter

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by("datetime")

    def get_serializer_context(self):
        # Pass the request to the serializer context
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @db_transaction.atomic
    def perform_create(self, serializer):
        # Save the transaction with the user
        transaction = serializer.save()

        # Updates the account balance.
        account = transaction.account
        if transaction.transaction_type == "income":
            account.balance += transaction.amount
            account.save()
        elif transaction.transaction_type == "expense":
            account.balance -= transaction.amount
            account.save()
        elif transaction.transaction_type == "transfer":
            # Checks if currencies are different then converts & deducts from the origin account and adds to destination account
            if transaction.account.currency != transaction.destination_account.currency:
                print("Cannot transfer between accounts with different currencies!")
                return None

            elif transaction.account and transaction.destination_account:
                mirrored_transaction = Transaction.objects.create(
                    user=transaction.user,
                    account=transaction.destination_account,
                    datetime=transaction.datetime,
                    amount=transaction.amount,
                    description="From: {0}".format(transaction.account),
                    transaction_type="transfer",
                    currency=transaction.currency,
                    category=transaction.category,
                    linked_transaction=transaction,
                )

                transaction.linked_transaction = mirrored_transaction
                transaction.save(update_fields=["linked_transaction"])

                # Deducts from the origin account and adds to destination account
                transaction.account.balance -= transaction.amount
                transaction.account.save()
                transaction.destination_account.balance += transaction.amount
                transaction.destination_account.save()


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    @db_transaction.atomic
    def perform_update(self, serializer):

        typeBool = bool
        # Old transaction details
        old = self.get_object()

        # Get linked_transaction if it exists.
        linked_acc = None
        linked_transaction = None

        if old.linked_transaction:
            try:
                linked_transaction = Transaction.objects.get(
                    id=old.linked_transaction.id
                )
                linked_acc = Account.objects.get(id=linked_transaction.account.id)
            except Exception as e:
                linked_acc = None
                linked_transaction = None
                print(e)

        # Revert transaction
        match old.transaction_type:
            case "income":
                old.account.balance -= old.amount
            case "expense":
                old.account.balance += old.amount
            case "transfer":
                # If the current transaction being edited is the mirror
                if old.destination_account is None:
                    typeBool = False
                    old.account.balance -= old.amount
                    if linked_acc is not None:
                        linked_acc.balance += old.amount
                # If the current transaction being edited is the original
                elif old.destination_account is not None:
                    typeBool = True
                    old.account.balance += old.amount
                    if linked_acc is not None:
                        linked_acc.balance -= old.amount

        old.account.save()
        if linked_acc is not None:
            linked_acc.save()

        # New transaction details
        new = serializer.save()

        # Validation checks
        if (
            old.transaction_type == "income" or old.transaction_type == "expense"
        ) and new.transaction_type == "transfer":
            raise serializers.ValidationError(
                "Cannot edit an income/expense transaction type to 'transfer'. Create a new transfer transaction instead."
            )
        if typeBool is False and new.destination_account is not None:
            raise serializers.ValidationError(
                "Cannot edit destination account after transfer creation"
            )
        if typeBool is False and new.account != old.account:
            raise serializers.ValidationError(
                "Cannot edit origin account after transfer creation"
            )
        if typeBool is True and new.destination_account != old.destination_account:
            raise serializers.ValidationError(
                "Cannot edit destination account after transfer creation"
            )
        if typeBool is True and new.account != old.account:
            raise serializers.ValidationError(
                "Cannot edit origin account after transfer creation"
            )
        if linked_acc is not None and new.transaction_type != "transfer":
            raise serializers.ValidationError(
                "Cannot change transaction type after creating a transfer"
            )

        # Update transaction
        if old.linked_transaction is not None:
            new.transaction_type = "transfer"

        match new.transaction_type:
            case "income":
                new.account.balance += new.amount
            case "expense":
                new.account.balance -= new.amount
            case "transfer":
                if old.destination_account is None:
                    new.account.balance += new.amount
                    if linked_acc and linked_transaction is not None:
                        linked_acc.balance -= new.amount
                        linked_transaction.amount = new.amount

                elif old.destination_account is not None:
                    new.account.balance -= new.amount
                    if linked_acc and linked_transaction is not None:
                        linked_acc.balance += new.amount
                        linked_transaction.amount = new.amount

        new.account.save()

        if linked_acc and linked_transaction is not None:
            linked_transaction.datetime = new.datetime
            linked_transaction.category = new.category
            linked_acc.save()
            linked_transaction.save()

    # Revert the transaction's effect on account balance
    @db_transaction.atomic
    def perform_destroy(self, instance):

        account = instance.account
        isMirror = bool
        linked_acc = None

        try:
            isMirror = False
            cmp = self.get_object()
            if (cmp.destination_account) is None:
                raise Exception

        except Exception:
            isMirror = True
            try:
                linked_transaction = Transaction.objects.get(
                    id=instance.linked_transaction.id
                )
                linked_acc = Account.objects.get(id=linked_transaction.account.id)
            except Exception as e:
                linked_acc = None
                print(e)

        match instance.transaction_type:
            case "income":
                account.balance -= instance.amount
            case "expense":
                account.balance += instance.amount
            case "transfer":
                if isMirror is False:
                    print("false")
                    instance.destination_account.balance -= instance.amount
                    instance.destination_account.save()
                    instance.account.balance += instance.amount
                    instance.account.save()
                elif isMirror is True:
                    instance.account.balance -= instance.amount
                    instance.account.save()
                    if linked_acc is not None:
                        linked_acc.balance += instance.amount
                        linked_acc.save()
        account.save()
        instance.delete()


class TransactionAggregateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # All user transactions.
        transactions = Transaction.objects.filter(user=request.user)

        # Filtered transactions.
        transactions_type = request.GET.get("transaction_type")
        if transactions_type:
            transactions = transactions.filter(transaction_type=transactions_type)

        category = request.GET.get("category")
        if category:
            transactions = transactions.filter(category__name__icontains=category)

        account = request.GET.get("account")
        if account:
            transactions = transactions.filter(
                Q(account__name__icontains=account)
                | Q(destination_account__name__icontains=account)
            )

        start_date = request.GET.get("start_date")
        if start_date:
            transactions = transactions.filter(datetime__date__gte=start_date)

        end_date = request.GET.get("end_date")
        if end_date:
            transactions = transactions.filter(datetime__date__lte=end_date)

        income_expense_transactions = transactions.exclude(transaction_type="transfer")

        # Calculate expenses, income & net worth (EXCLUDING transfers)
        income = (
            income_expense_transactions.filter(transaction_type="income").aggregate(
                total=Sum("amount")
            )["total"]
            or 0
        )
        expenses = (
            income_expense_transactions.filter(transaction_type="expense").aggregate(
                total=Sum("amount")
            )["total"]
            or 0
        )
        net = income - expenses

        return Response(
            {
                "income": float(income),
                "expense": float(expenses),
                "net": float(net),
                "transaction_count": transactions.count(),
                "filters_applied": dict(request.GET),
            }
        )
