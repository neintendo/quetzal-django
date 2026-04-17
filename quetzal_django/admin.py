from django.contrib import admin

from quetzal_django.models import Account, Category, ExchangeRates, Transaction, User


class ExchangeRatesAdmin(admin.ModelAdmin):
    list_display = (
        "date",
        "base",
        "rates",
    )


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "display_name",
        "email",
        "main_currency",
    )


class AccountAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "balance",
        "currency",
        "type",
        "user",
    )


class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)


class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "account",
        "datetime",
        "amount",
        "currency",
        "category",
        "description",
        "transaction_type",
        "linked_transaction__id",
    )


admin.site.register(ExchangeRates, ExchangeRatesAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Account, AccountAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Transaction, TransactionAdmin)
