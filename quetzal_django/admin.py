from django.contrib import admin

from quetzal_django.models import Account, Category, ExchangeRates, Transaction, User

admin.site.register(ExchangeRates)
admin.site.register(User)
admin.site.register(Account)
admin.site.register(Category)
admin.site.register(Transaction)
