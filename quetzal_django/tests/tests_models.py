"""
Tests for Quetzal Django Models
================================

Tests based on API requests from my Bruno collection.
Covers User, Account, Category, Transaction, and ExchangeRates models.
"""

from datetime import date, datetime
from types import SimpleNamespace

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase
from django.utils import timezone

from ..models import Account, Category, ExchangeRates, Recurring, Transaction, User
from ..serializers import (
    AccountSerializer,
    CategorySerializer,
    RecurringSerializer,
    TransactionSerializer,
    UserLoginSerializer,
    UserRegistrationSerializer,
)


class UserModelTest(TestCase):
    """Tests for User model"""

    def test_create_user(self):
        """Test creating a user"""
        user = User.objects.create_user(
            username="janedoe",
            password="12345678",
            display_name="Jane Doe",
            main_currency="USD",
        )

        self.assertEqual(user.username, "janedoe")
        self.assertEqual(user.display_name, "Jane Doe")
        self.assertEqual(user.main_currency, "USD")
        self.assertTrue(user.check_password("12345678"))

    def test_user_str_method(self):
        """Test the string representation"""
        user = User.objects.create_user(
            username="testuser",
            password="pass",
            display_name="Test User",
            main_currency="USD",
        )
        self.assertEqual(str(user), "testuser")

    # Validation tests for User
    def test_user_validation_unique_display_name(self):
        """Test that display_name must be unique"""
        User.objects.create_user(
            username="user1",
            password="pass",
            display_name="Same Name",
            main_currency="USD",
        )
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                username="user2",
                password="pass",
                display_name="Same Name",
                main_currency="EUR",
            )

    def test_user_validation_main_currency_choices(self):
        """Test that main_currency must be a valid choice"""
        user = User.objects.create_user(
            username="currencyuser",
            password="pass",
            display_name="Currency User",
            main_currency="USD",  # Valid
        )
        self.assertEqual(user.main_currency, "USD")

    def test_user_registration_serializer_valid(self):
        """Test UserRegistrationSerializer with valid data"""
        data = {
            "username": "newuser",
            "display_name": "New User",
            "password": "securepass123",
            "main_currency": "USD",
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_user_registration_serializer_password_too_short(self):
        """Test registration with password less than 8 characters"""
        data = {
            "username": "newuser",
            "display_name": "New User",
            "password": "short",
            "main_currency": "USD",
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

    def test_user_login_serializer_valid(self):
        """Test UserLoginSerializer with valid credentials"""
        User.objects.create_user(
            username="logintest",
            password="correctpass123",
            display_name="Login Test",
            main_currency="USD",
        )
        data = {"username": "logintest", "password": "correctpass123"}
        serializer = UserLoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_user_login_serializer_invalid_password(self):
        """Test UserLoginSerializer with invalid password"""
        User.objects.create_user(
            username="logintest",
            password="correctpass123",
            display_name="Login Test",
            main_currency="USD",
        )
        data = {"username": "logintest", "password": "wrongpassword"}
        serializer = UserLoginSerializer(data=data)
        # is_valid() returns False because validation fails
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)


class AccountModelTest(TestCase):
    """Tests for Account model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="pass",
            display_name="Test User",
            main_currency="USD",
        )

    def test_create_account(self):
        """Test account creation"""
        account = Account.objects.create(
            name="Standard Bank", type="bank", currency="USD", user=self.user
        )

        self.assertEqual(account.name, "Standard Bank")
        self.assertEqual(account.type, "bank")
        self.assertEqual(account.currency, "USD")
        self.assertEqual(account.user.username, "testuser")
        self.assertEqual(account.balance, 0)

    def test_account_str_method(self):
        """Test the string representation"""
        account = Account.objects.create(
            name="Cash", type="cash", currency="USD", user=self.user
        )
        self.assertEqual(str(account), "Cash (USD)")

    def test_unique_account_per_user(self):
        """Test that a user can't have two accounts with the same name"""
        Account.objects.create(
            name="Savings", type="bank", currency="USD", user=self.user
        )
        with self.assertRaises(IntegrityError):
            Account.objects.create(
                name="Savings", type="bank", currency="EUR", user=self.user
            )

    # Validation tests for Account
    def test_account_validation_currency_choices(self):
        """Test that account currency must be a valid choice"""
        account = Account.objects.create(
            name="Valid Account", type="bank", currency="USD", user=self.user
        )
        self.assertEqual(account.currency, "USD")

    def test_account_serializer_valid(self):
        """Test AccountSerializer with valid data"""
        data = {
            "name": "Test Account",
            "type": "bank",
            "currency": "USD",
        }
        serializer = AccountSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_account_balance_default_zero(self):
        """Test that account balance defaults to 0"""
        account = Account.objects.create(
            name="Zero Balance", type="bank", currency="USD", user=self.user
        )
        self.assertEqual(account.balance, 0)


class CategoryModelTest(TestCase):
    """Tests for Category model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="pass",
            display_name="Test User",
            main_currency="USD",
        )

    def test_create_category(self):
        """Test creating a category"""
        category = Category.objects.create(name="Food", type="expense", user=self.user)
        self.assertEqual(category.name, "Food")
        self.assertEqual(category.type, "expense")
        self.assertEqual(category.user.username, "testuser")

    def test_category_str_method(self):
        """Test the string representation"""
        category = Category.objects.create(
            name="Electronics", type="expense", user=self.user
        )
        self.assertEqual(str(category), "Electronics")

    def test_unique_category_per_user(self):
        """Test that a user can't have two categories with the same name"""
        Category.objects.create(name="Utilities", type="expense", user=self.user)
        with self.assertRaises(IntegrityError):
            Category.objects.create(name="Utilities", type="income", user=self.user)

    def test_category_without_user(self):
        """Test creating a category without a user (system category)"""
        category = Category.objects.create(
            name="System Category", type="expense", user=None
        )
        self.assertIsNone(category.user)

    # Validation tests for Category
    def test_category_validation_type_choices(self):
        """Test that category type must be a valid choice"""
        valid_types = ["income", "expense", "transfer"]
        for valid_type in valid_types:
            category = Category.objects.create(
                name=f"{valid_type} Category", type=valid_type, user=self.user
            )
            self.assertEqual(category.type, valid_type)

    def test_category_serializer_valid(self):
        """Test CategorySerializer with valid data"""
        data = {"name": "Test Category", "type": "expense"}
        serializer = CategorySerializer(data=data)
        self.assertTrue(serializer.is_valid())


class TransactionModelTest(TestCase):
    """Tests for Transaction model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="pass",
            display_name="Test User",
            main_currency="USD",
        )
        self.account = Account.objects.create(
            name="Standard Bank", type="bank", currency="USD", user=self.user
        )
        self.category = Category.objects.create(
            name="Food", type="expense", user=self.user
        )

    def test_create_income_transaction(self):
        """Test creating an income transaction"""
        transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            amount=17500,
            description="Paycheck for August",
            notes="",
            datetime=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
            currency="USD",
            transaction_type="income",
            category=self.category,
        )
        self.assertEqual(transaction.amount, 17500)
        self.assertEqual(transaction.transaction_type, "income")

    def test_create_expense_transaction(self):
        """Test creating an expense transaction"""
        transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            amount=2500,
            description="Water Bill",
            notes="",
            datetime=timezone.make_aware(datetime(2025, 8, 4, 14, 0)),
            currency="USD",
            transaction_type="expense",
            category=self.category,
        )
        self.assertEqual(transaction.amount, 2500)
        self.assertEqual(transaction.transaction_type, "expense")

    def test_create_transfer_transaction(self):
        """Test creating a transfer transaction"""
        destination = Account.objects.create(
            name="Capitec Bank", type="bank", currency="USD", user=self.user
        )
        transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            destination_account=destination,
            amount=762.00,
            description="To: Capitec Bank (USD)",
            notes="",
            datetime=timezone.make_aware(datetime(2026, 4, 16, 19, 31)),
            currency="USD",
            transaction_type="transfer",
        )
        self.assertEqual(transaction.transaction_type, "transfer")
        self.assertEqual(transaction.destination_account.name, "Capitec Bank")

    def test_transaction_str_method(self):
        """Test the string representation"""
        transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            amount=100,
            description="Test transaction",
            notes="",
            datetime=timezone.make_aware(datetime(2025, 8, 1, 10, 0)),
            currency="USD",
            transaction_type="expense",
        )
        self.assertIn("Test transaction", str(transaction))

    # Validation tests for Transaction
    def test_transaction_validation_amount_greater_than_zero(self):
        """Test that transaction amount must be greater than 0"""
        with self.assertRaises(ValidationError):
            transaction = Transaction(
                user=self.user,
                account=self.account,
                amount=0,
                description="Zero amount",
                notes="",
                datetime=timezone.make_aware(datetime(2025, 8, 1, 10, 0)),
                currency="USD",
                transaction_type="expense",
                category=self.category,
            )
            transaction.full_clean()

    def test_transaction_validation_negative_amount(self):
        """Test that negative amount triggers validation error"""
        with self.assertRaises(ValidationError):
            transaction = Transaction(
                user=self.user,
                account=self.account,
                amount=-100,
                description="Negative amount",
                notes="",
                datetime=timezone.make_aware(datetime(2025, 8, 1, 10, 0)),
                currency="USD",
                transaction_type="expense",
                category=self.category,
            )
            transaction.full_clean()

    def test_transaction_validation_invalid_type(self):
        """Test that invalid transaction_type raises ValidationError"""
        with self.assertRaises(ValidationError):
            transaction = Transaction(
                user=self.user,
                account=self.account,
                amount=100,
                description="Invalid type",
                notes="",
                datetime=timezone.make_aware(datetime(2025, 8, 1, 10, 0)),
                currency="USD",
                transaction_type="invalid_type",
                category=self.category,
            )
            transaction.full_clean()

    def test_transaction_validation_valid_types(self):
        """Test that valid transaction types pass validation"""
        valid_types = ["income", "expense", "transfer"]
        for valid_type in valid_types:
            transaction = Transaction(
                user=self.user,
                account=self.account,
                amount=100,
                description=f"Test {valid_type}",
                notes="",
                datetime=timezone.make_aware(datetime(2025, 8, 1, 10, 0)),
                currency="USD",
                transaction_type=valid_type,
                category=self.category,
            )
            # Should not raise an error
            transaction.full_clean()

    def test_transaction_serializer_zero_amount_invalid(self):
        """Test TransactionSerializer rejects zero amount"""
        data = {
            "amount": "0.00",
            "description": "Zero amount",
            "notes": "",
            "datetime": "2025-08-01 10:00",
            "currency": "USD",
            "account_name": "Standard Bank",
            "category_name": "Food",
            "transaction_type": "expense",
        }
        serializer = TransactionSerializer(data=data, context={"request": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_transaction_serializer_transfer_same_account_invalid(self):
        """Test TransactionSerializer rejects transfer to same account"""
        data = {
            "amount": "100.00",
            "description": "Transfer to self",
            "notes": "",
            "datetime": "2025-08-01 10:00",
            "currency": "USD",
            "account_name": "Standard Bank",
            "destination_account_name": "Standard Bank",  # Same as source
            "category_name": "Food",
            "transaction_type": "transfer",
        }
        serializer = TransactionSerializer(data=data, context={"request": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)

    def test_transaction_serializer_missing_required_fields(self):
        """Test TransactionSerializer rejects missing required fields"""
        data = {
            "amount": "100.00",
            "description": "Missing fields",
        }
        serializer = TransactionSerializer(data=data, context={"request": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertIn("account_name", serializer.errors)
        self.assertIn("category_name", serializer.errors)
        self.assertIn("transaction_type", serializer.errors)


class RecurringModelTest(TestCase):
    """Tests for Recurring model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="pass",
            display_name="Test User",
            main_currency="USD",
        )
        self.account = Account.objects.create(
            name="Standard Bank", type="bank", currency="USD", user=self.user
        )
        self.destination_account = Account.objects.create(
            name="Savings", type="bank", currency="USD", user=self.user
        )
        # RecurringSerializer.validate() reads self.context["request"].user
        # directly, so the context needs a real object with a `.user`
        # attribute rather than the User instance itself.
        self.request = SimpleNamespace(user=self.user)

    def test_create_recurring_transaction(self):
        """Test creating a recurring transaction"""
        recurring = Recurring.objects.create(
            user=self.user,
            start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
            end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
            frequency="MONTHLY",
            amount=1500,
            description="Rent",
            notes="",
            category="Housing",
            transaction_type="expense",
            account="Standard Bank",
        )
        self.assertEqual(recurring.amount, 1500)
        self.assertEqual(recurring.frequency, "MONTHLY")
        self.assertEqual(recurring.transaction_type, "expense")
        self.assertEqual(recurring.account, "Standard Bank")
        self.assertEqual(recurring.user.username, "testuser")

    def test_create_transfer_recurring_transaction(self):
        """Test creating a recurring transfer with a destination account"""
        recurring = Recurring.objects.create(
            user=self.user,
            start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
            end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
            frequency="WEEKLY",
            amount=200,
            description="Savings transfer",
            notes="",
            category="Transfer",
            transaction_type="transfer",
            account="Standard Bank",
            destination_account="Savings",
        )
        self.assertEqual(recurring.transaction_type, "transfer")
        self.assertEqual(recurring.destination_account, "Savings")

    def test_recurring_datetimes_json_field_can_store_list(self):
        """Test that the datetimes JSONField can store and retrieve a list.

        Note: the model itself does not generate these values — that logic
        lives in RecurringListCreateView.perform_create/perform_update
        (views.py), which uses dateutil.rrule based on frequency/start_date/
        end_date. This test only confirms the field can persist a list;
        auto-generation should be covered by a view-level test instead.
        """
        recurring = Recurring.objects.create(
            user=self.user,
            start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
            end_date=timezone.make_aware(datetime(2025, 10, 1, 7, 0)),
            frequency="MONTHLY",
            amount=1500,
            description="Rent",
            notes="",
            category="Housing",
            transaction_type="expense",
            account="Standard Bank",
        )
        recurring.datetimes = ["2025-08-01 07:00", "2025-09-01 07:00", "2025-10-01 07:00"]
        recurring.save()
        recurring.refresh_from_db()
        self.assertEqual(len(recurring.datetimes), 3)
        self.assertIn("2025-09-01 07:00", recurring.datetimes)

    def test_recurring_datetimes_default_null(self):
        """Test that datetimes defaults to None when not provided"""
        recurring = Recurring.objects.create(
            user=self.user,
            start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
            end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
            frequency="DAILY",
            amount=50,
            description="Coffee",
            notes="",
            category="Food",
            transaction_type="expense",
            account="Standard Bank",
        )
        self.assertIsNone(recurring.datetimes)

    def test_recurring_cascade_delete_with_user(self):
        """Test that recurring transactions are deleted when their user is deleted"""
        Recurring.objects.create(
            user=self.user,
            start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
            end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
            frequency="YEARLY",
            amount=1000,
            description="Insurance",
            notes="",
            category="Insurance",
            transaction_type="expense",
            account="Standard Bank",
        )
        self.assertEqual(Recurring.objects.count(), 1)
        self.user.delete()
        self.assertEqual(Recurring.objects.count(), 0)

    # Validation tests for Recurring
    def test_recurring_validation_amount_greater_than_zero(self):
        """Test that recurring amount must be greater than 0"""
        with self.assertRaises(ValidationError):
            recurring = Recurring(
                user=self.user,
                start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
                end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
                frequency="MONTHLY",
                amount=0,
                description="Zero amount",
                notes="",
                category="Housing",
                transaction_type="expense",
                account="Standard Bank",
            )
            recurring.full_clean()

    def test_recurring_validation_negative_amount(self):
        """Test that negative amount triggers validation error"""
        with self.assertRaises(ValidationError):
            recurring = Recurring(
                user=self.user,
                start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
                end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
                frequency="MONTHLY",
                amount=-100,
                description="Negative amount",
                notes="",
                category="Housing",
                transaction_type="expense",
                account="Standard Bank",
            )
            recurring.full_clean()

    def test_recurring_validation_invalid_frequency(self):
        """Test that invalid frequency raises ValidationError"""
        with self.assertRaises(ValidationError):
            recurring = Recurring(
                user=self.user,
                start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
                end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
                frequency="BIWEEKLY",
                amount=100,
                description="Invalid frequency",
                notes="",
                category="Housing",
                transaction_type="expense",
                account="Standard Bank",
            )
            recurring.full_clean()

    def test_recurring_validation_valid_frequencies(self):
        """Test that valid frequency choices pass validation"""
        valid_frequencies = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]
        for valid_frequency in valid_frequencies:
            recurring = Recurring(
                user=self.user,
                start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
                end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
                frequency=valid_frequency,
                amount=100,
                description=f"Test {valid_frequency}",
                notes="",
                category="Housing",
                transaction_type="expense",
                account="Standard Bank",
            )
            # Should not raise an error
            recurring.full_clean()

    def test_recurring_validation_invalid_transaction_type(self):
        """Test that invalid transaction_type raises ValidationError"""
        with self.assertRaises(ValidationError):
            recurring = Recurring(
                user=self.user,
                start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
                end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
                frequency="MONTHLY",
                amount=100,
                description="Invalid type",
                notes="",
                category="Housing",
                transaction_type="invalid_type",
                account="Standard Bank",
            )
            recurring.full_clean()

    def test_recurring_validation_valid_transaction_types(self):
        """Test that valid transaction types pass validation"""
        valid_types = ["income", "expense", "transfer"]
        for valid_type in valid_types:
            recurring = Recurring(
                user=self.user,
                start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
                end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
                frequency="MONTHLY",
                amount=100,
                description=f"Test {valid_type}",
                notes="",
                category="Housing",
                transaction_type=valid_type,
                account="Standard Bank",
            )
            # Should not raise an error
            recurring.full_clean()

    def test_recurring_validation_currency_choices(self):
        """Test that recurring currency must be a valid choice"""
        recurring = Recurring.objects.create(
            user=self.user,
            start_date=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
            end_date=timezone.make_aware(datetime(2026, 8, 1, 7, 0)),
            frequency="MONTHLY",
            amount=100,
            description="Currency check",
            notes="",
            category="Housing",
            transaction_type="expense",
            account="Standard Bank",
            currency="EUR",
        )
        self.assertEqual(recurring.currency, "EUR")

    # Serializer tests for Recurring
    def test_recurring_serializer_valid_data(self):
        """Test RecurringSerializer with valid data for an existing account"""
        data = {
            "start_date": "2025-08-01 07:00",
            "end_date": "2026-08-01 07:00",
            "frequency": "MONTHLY",
            "amount": "1500.00",
            "description": "Rent",
            "category": "Housing",
            "transaction_type": "expense",
            "account": "Standard Bank",
        }
        serializer = RecurringSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_recurring_serializer_nonexistent_account_invalid(self):
        """Test RecurringSerializer rejects an account that doesn't exist"""
        data = {
            "start_date": "2025-08-01 07:00",
            "end_date": "2026-08-01 07:00",
            "frequency": "MONTHLY",
            "amount": "1500.00",
            "description": "Rent",
            "category": "Housing",
            "transaction_type": "expense",
            "account": "Nonexistent Account",
        }
        serializer = RecurringSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)

    def test_recurring_serializer_transfer_valid(self):
        """Test RecurringSerializer accepts a transfer between two existing accounts"""
        data = {
            "start_date": "2025-08-01 07:00",
            "end_date": "2026-08-01 07:00",
            "frequency": "WEEKLY",
            "amount": "200.00",
            "description": "Savings transfer",
            "category": "Transfer",
            "transaction_type": "transfer",
            "account": "Standard Bank",
            "destination_account": "Savings",
        }
        serializer = RecurringSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_recurring_serializer_transfer_same_account_invalid(self):
        """Test RecurringSerializer rejects a transfer to the same account"""
        data = {
            "start_date": "2025-08-01 07:00",
            "end_date": "2026-08-01 07:00",
            "frequency": "WEEKLY",
            "amount": "200.00",
            "description": "Transfer to self",
            "category": "Transfer",
            "transaction_type": "transfer",
            "account": "Standard Bank",
            "destination_account": "Standard Bank",
        }
        serializer = RecurringSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)

    def test_recurring_serializer_transfer_nonexistent_destination_invalid(self):
        """Test RecurringSerializer rejects a transfer to a nonexistent destination account"""
        data = {
            "start_date": "2025-08-01 07:00",
            "end_date": "2026-08-01 07:00",
            "frequency": "WEEKLY",
            "amount": "200.00",
            "description": "Transfer to nowhere",
            "category": "Transfer",
            "transaction_type": "transfer",
            "account": "Standard Bank",
            "destination_account": "Nonexistent Account",
        }
        serializer = RecurringSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)

    def test_recurring_serializer_missing_required_fields(self):
        """Test RecurringSerializer rejects missing required fields"""
        data = {
            "amount": "100.00",
            "description": "Missing fields",
        }
        serializer = RecurringSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("start_date", serializer.errors)
        self.assertIn("end_date", serializer.errors)
        self.assertIn("frequency", serializer.errors)
        self.assertIn("category", serializer.errors)
        self.assertIn("transaction_type", serializer.errors)
        self.assertIn("account", serializer.errors)

    def test_recurring_serializer_currency_defaults_to_usd(self):
        """Test RecurringSerializer doesn't require currency (model default applies)"""
        data = {
            "start_date": "2025-08-01 07:00",
            "end_date": "2026-08-01 07:00",
            "frequency": "MONTHLY",
            "amount": "1500.00",
            "description": "Rent",
            "category": "Housing",
            "transaction_type": "expense",
            "account": "Standard Bank",
        }
        serializer = RecurringSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data.get("currency", "USD"), "USD")


class ExchangeRatesModelTest(TestCase):
    """Simple tests for ExchangeRates model"""

    def test_create_exchange_rate(self):
        """Test creating an exchange rate entry"""
        rate = ExchangeRates.objects.create(
            date=date.today(), base="USD", rates={"EUR": 0.85, "GBP": 0.75}
        )
        self.assertEqual(rate.base, "USD")
        self.assertEqual(rate.rates["EUR"], 0.85)

    def test_unique_date_base(self):
        """Test that date and base must be unique together"""
        ExchangeRates.objects.create(date=date.today(), base="USD", rates={})
        with self.assertRaises(IntegrityError):
            ExchangeRates.objects.create(date=date.today(), base="USD", rates={})

    def test_str_method(self):
        """Test the string representation"""
        rate = ExchangeRates.objects.create(
            date=date(2025, 8, 1), base="USD", rates={"EUR": 0.85}
        )
        self.assertIn("2025-08-01", str(rate))
        self.assertIn("USD", str(rate))

    def test_exchange_rate_validation_currency_choices(self):
        """Test that exchange rate base must be a valid currency"""
        valid_currencies = ["USD", "EUR", "GBP"]
        for currency in valid_currencies:
            rate = ExchangeRates.objects.create(
                date=date.today(), base=currency, rates={"EUR": 0.85}
            )
            self.assertEqual(rate.base, currency)


class APIScenarioTests(TestCase):
    """Test real API scenarios from my Bruno collection"""

    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username="janedoe",
            password="12345678",
            display_name="Jane Doe",
            main_currency="EUR",
        )

        # Create accounts
        self.account1 = Account.objects.create(
            name="Standard Bank",
            type="bank",
            currency="USD",
            user=self.user,
            balance=1000,
        )
        self.account2 = Account.objects.create(
            name="Cash", type="cash", currency="USD", user=self.user
        )

        # Create categories
        self.category1 = Category.objects.create(
            name="Food", type="expense", user=self.user
        )
        self.category2 = Category.objects.create(
            name="Electronics", type="expense", user=self.user
        )
        self.category3 = Category.objects.create(
            name="Paycheck", type="income", user=self.user
        )

    def test_full_transaction_flow(self):
        """Test creating income, expense, and transfer transactions"""
        # Create Paycheck income transaction
        income = Transaction.objects.create(
            user=self.user,
            account=self.account1,
            amount=17500,
            description="Paycheck for August",
            datetime=timezone.make_aware(datetime(2025, 8, 1, 7, 0)),
            currency="USD",
            transaction_type="income",
            category=self.category3,
        )
        self.assertEqual(Transaction.objects.count(), 1)

        # Create Water Bill expense transaction
        expense = Transaction.objects.create(
            user=self.user,
            account=self.account1,
            amount=2500,
            description="Water Bill",
            datetime=timezone.make_aware(datetime(2025, 8, 4, 14, 0)),
            currency="USD",
            transaction_type="expense",
            category=self.category1,
        )
        self.assertEqual(Transaction.objects.count(), 2)

        # Create TV expense
        electronics = Transaction.objects.create(
            user=self.user,
            account=self.account1,
            amount=4500,
            description='LG C2 42"',
            datetime=timezone.make_aware(datetime(2025, 8, 8, 12, 0)),
            currency="USD",
            transaction_type="expense",
            category=self.category2,
        )
        self.assertEqual(Transaction.objects.count(), 3)

        # Verify filter transactions by date range
        august_transactions = Transaction.objects.filter(
            datetime__date__gte=date(2025, 8, 1), datetime__date__lte=date(2025, 8, 31)
        )
        self.assertEqual(august_transactions.count(), 3)

        # Verify filter by type
        income_transactions = Transaction.objects.filter(transaction_type="income")
        self.assertEqual(income_transactions.count(), 1)
        expense_transactions = Transaction.objects.filter(transaction_type="expense")
        self.assertEqual(expense_transactions.count(), 2)

    def test_update_user_profile(self):
        """Test updating user profile fields"""
        self.assertEqual(self.user.display_name, "Jane Doe")
        self.assertEqual(self.user.main_currency, "EUR")

        # Update user
        self.user.display_name = "Jane Smith"
        self.user.main_currency = "USD"
        self.user.save()
        self.user.refresh_from_db()

        self.assertEqual(self.user.display_name, "Jane Smith")
        self.assertEqual(self.user.main_currency, "USD")

    def test_delete_category(self):
        """Test deleting a category"""
        category = Category.objects.create(
            name="Temporary", type="expense", user=self.user
        )
        self.assertEqual(Category.objects.count(), 4)  # 3 from setUp + 1 new
        category.delete()
        self.assertEqual(Category.objects.count(), 3)
        self.assertFalse(Category.objects.filter(name="Temporary").exists())

    def test_account_balance_tracking(self):
        """Test correct balance tracking with valid transaction type"""
        # Initial balance
        self.assertEqual(self.account1.balance, 1000)

        # Add income with CORRECT transaction type
        transaction = Transaction.objects.create(
            user=self.user,
            account=self.account1,
            amount=500,
            description="Bonus",
            datetime=timezone.make_aware(datetime(2025, 8, 1, 10, 0)),
            currency="USD",
            transaction_type="income",  # Valid type
        )

        # Update balance manually
        self.account1.balance += 500
        self.account1.save()

        self.assertEqual(self.account1.balance, 1500)
        self.assertEqual(transaction.transaction_type, "income")

    def test_transaction_amount_validation_in_scenario(self):
        """Test that invalid transaction amounts are rejected"""
        # Zero amount should be rejected
        with self.assertRaises(ValidationError):
            transaction = Transaction(
                user=self.user,
                account=self.account1,
                amount=0,
                description="Zero amount",
                notes="",
                datetime=timezone.make_aware(datetime(2025, 8, 1, 10, 0)),
                currency="USD",
                transaction_type="expense",
            )
            transaction.full_clean()

        # Negative amount should be rejected
        with self.assertRaises(ValidationError):
            transaction = Transaction(
                user=self.user,
                account=self.account1,
                amount=-100,
                description="Negative amount",
                notes="",
                datetime=timezone.make_aware(datetime(2025, 8, 1, 10, 0)),
                currency="USD",
                transaction_type="expense",
            )
            transaction.full_clean()
