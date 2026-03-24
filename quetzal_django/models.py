from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.functions import Now


class ExchangeRates(models.Model):
    CURRENCIES = [
        ("AUD", "Australian Dollar"),
        ("BRL", "Brazilian Real"),
        ("CAD", "Canadian Dollar"),
        ("CHF", "Swiss Franc"),
        ("CNY", "Chinese Renminbi Yuan"),
        ("CZK", "Czech Koruna"),
        ("DKK", "Danish Krone"),
        ("EUR", "Euro"),
        ("GBP", "British Pound"),
        ("HKD", "Hong Kong Dollar"),
        ("HUF", "Hungarian Forint"),
        ("IDR", "Indonesian Rupiah"),
        ("ILS", "Israeli New Shekel"),
        ("INR", "Indian Rupee"),
        ("ISK", "Icelandic Króna"),
        ("JPY", "Japanese Yen"),
        ("KRW", "South Korean Won"),
        ("MXN", "Mexican Peso"),
        ("MYR", "Malaysian Ringgit"),
        ("NOK", "Norwegian Krone"),
        ("NZD", "New Zealand Dollar"),
        ("PHP", "Philippine Peso"),
        ("PLN", "Polish Złoty"),
        ("RON", "Romanian Leu"),
        ("SEK", "Swedish Krona"),
        ("SGD", "Singapore Dollar"),
        ("THB", "Thai Baht"),
        ("TRY", "Turkish Lira"),
        ("USD", "United States Dollar"),
        ("ZAR", "South African Rand"),
    ]

    date = models.DateField()
    base = models.CharField(max_length=3, choices=CURRENCIES)
    rates = models.JSONField()

    def __str__(self):
        return f"{self.date} - {self.base} {self.rates}"


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=320)
    display_name = models.CharField(unique=True, max_length=100)
    main_currency = models.CharField(
        max_length=10, choices=ExchangeRates.CURRENCIES, default="USD"
    )

    def __str__(self):
        return self.username


class Account(models.Model):
    ACCOUNT_TYPES = [
        ("cash", "Cash"),
        ("bank", "Bank"),
        ("investment", "Investment"),
        ("savings", "Savings"),
        ("credit", "Credit Card"),
        ("loan", "Loan"),
        ("other", "Other"),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=ACCOUNT_TYPES)
    currency = models.CharField(
        max_length=30, choices=ExchangeRates.CURRENCIES, default="USD"
    )
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        # Account names are unique per user.
        unique_together = ["name", "user"]

    def __str__(self):
        return f"{self.name} ({self.currency})"


class Category(models.Model):
    CATEGORY_TYPES = [
        ("income", "Income"),
        ("expense", "Expense"),
        ("transfer", "Transfer"),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(choices=CATEGORY_TYPES)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        # Account names are unique per user.
        unique_together = ["name", "user"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.name} ({self.type})"


class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="outgoing_transactions",
    )
    destination_account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="incoming_transactions",
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, null=True, blank=True
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField()
    datetime = models.DateTimeField(db_default=Now())
    currency = models.CharField(
        max_length=30, choices=ExchangeRates.CURRENCIES, default="USD"
    )
    transaction_type = models.CharField(
        max_length=10, choices=Category.CATEGORY_TYPES, null=True, blank=True
    )

    def __str__(self):
        return f"{self.datetime} - {self.amount} {self.currency} - {self.description}"
