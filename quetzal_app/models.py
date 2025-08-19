from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=320)

    def __str__(self):
        return self.username

class Currency(models.Model):
    # PSEUDOCODE JUST FOR NOW
    pass
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
    name = models.CharField(unique=True, max_length=100)
    type = models.CharField(max_length=50, choices=ACCOUNT_TYPES)
    currency_type = models.ForeignKey(Currency, on_delete=models.RESTRICT)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
class Category(models.Model):
    CATEGORY_TYPES = [
        ("income", "Income"),
        ("expense", "Expense"),
        ("transfer", "Transfer"),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(choices=CATEGORY_TYPES)

class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_id = models.ForeignKey(Account, on_delete=models.CASCADE)
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.IntegerField()
    description = models.TextField()
    date = models.DateField()
    currency_ref = models.ForeignKey(Currency, on_delete=models.RESTRICT)
