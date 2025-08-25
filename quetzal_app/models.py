from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    CURRENCIES = [
        ("AED", "United Arab Emirates Dirham"),
        ("AFN", "Afghan Afghani"),
        ("ALL", "Albanian Lek"),
        ("AMD", "Armenian Dram"),
        ("ANG", "Netherlands Antillean Guilder"),
        ("AOA", "Angolan Kwanza"),
        ("ARS", "Argentine Peso"),
        ("AUD", "Australian Dollar"),
        ("AWG", "Aruban Florin"),
        ("AZN", "Azerbaijani Manat"),
        ("BAM", "Bosnia-Herzegovina Convertible Mark"),
        ("BBD", "Barbadian Dollar"),
        ("BDT", "Bangladeshi Taka"),
        ("BGN", "Bulgarian Lev"),
        ("BHD", "Bahraini Dinar"),
        ("BIF", "Burundian Franc"),
        ("BMD", "Bermudian Dollar"),
        ("BND", "Brunei Dollar"),
        ("BOB", "Bolivian Boliviano"),
        ("BRL", "Brazilian Real"),
        ("BSD", "Bahamian Dollar"),
        ("BTN", "Bhutanese Ngultrum"),
        ("BWP", "Botswana Pula"),
        ("BYN", "Belarusian Ruble"),
        ("BZD", "Belize Dollar"),
        ("CAD", "Canadian Dollar"),
        ("CHF", "Swiss Franc"),
        ("CLP", "Chilean Peso"),
        ("CNY", "Chinese Yuan"),
        ("COP", "Colombian Peso"),
        ("CRC", "Costa Rican Colón"),
        ("CUP", "Cuban Peso"),
        ("CVE", "Cape Verdean Escudo"),
        ("CZK", "Czech Koruna"),
        ("DJF", "Djiboutian Franc"),
        ("DKK", "Danish Krone"),
        ("DOP", "Dominican Peso"),
        ("DZD", "Algerian Dinar"),
        ("EGP", "Egyptian Pound"),
        ("ETB", "Ethiopian Birr"),
        ("EUR", "Euro"),
        ("FJD", "Fijian Dollar"),
        ("GBP", "British Pound"),
        ("GEL", "Georgian Lari"),
        ("GHS", "Ghanaian Cedi"),
        ("GMD", "Gambian Dalasi"),
        ("GNF", "Guinean Franc"),
        ("GTQ", "Guatemalan Quetzal"),
        ("HKD", "Hong Kong Dollar"),
        ("HNL", "Honduran Lempira"),
        ("HRK", "Croatian Kuna"),
        ("HUF", "Hungarian Forint"),
        ("IDR", "Indonesian Rupiah"),
        ("ILS", "Israeli New Shekel"),
        ("INR", "Indian Rupee"),
        ("IQD", "Iraqi Dinar"),
        ("ISK", "Icelandic Krona"),
        ("JMD", "Jamaican Dollar"),
        ("JPY", "Japanese Yen"),
        ("KES", "Kenyan Shilling"),
        ("KGS", "Kyrgyzstani Som"),
        ("KHR", "Cambodian Riel"),
        ("KRW", "South Korean Won"),
        ("KWD", "Kuwaiti Dinar"),
        ("KZT", "Kazakhstani Tenge"),
        ("LAK", "Lao Kip"),
        ("LBP", "Lebanese Pound"),
        ("LKR", "Sri Lankan Rupee"),
        ("LYD", "Libyan Dinar"),
        ("MAD", "Moroccan Dirham"),
        ("MDL", "Moldovan Leu"),
        ("MKD", "Macedonian Denar"),
        ("MMK", "Myanmar Kyat"),
        ("MNT", "Mongolian Tögrög"),
        ("MUR", "Mauritian Rupee"),
        ("MVR", "Maldivian Rufiyaa"),
        ("MWK", "Malawian Kwacha"),
        ("MXN", "Mexican Peso"),
        ("MYR", "Malaysian Ringgit"),
        ("MZN", "Mozambican Metical"),
        ("NAD", "Namibian Dollar"),
        ("NGN", "Nigerian Naira"),
        ("NIO", "Nicaraguan Córdoba"),
        ("NOK", "Norwegian Krone"),
        ("NPR", "Nepalese Rupee"),
        ("NZD", "New Zealand Dollar"),
        ("OMR", "Omani Rial"),
        ("PAB", "Panamanian Balboa"),
        ("PEN", "Peruvian Sol"),
        ("PGK", "Papua New Guinean Kina"),
        ("PHP", "Philippine Peso"),
        ("PKR", "Pakistani Rupee"),
        ("PLN", "Polish Złoty"),
        ("PYG", "Paraguayan Guaraní"),
        ("QAR", "Qatari Riyal"),
        ("RON", "Romanian Leu"),
        ("RSD", "Serbian Dinar"),
        ("RUB", "Russian Ruble"),
        ("RWF", "Rwandan Franc"),
        ("SAR", "Saudi Riyal"),
        ("SEK", "Swedish Krona"),
        ("SGD", "Singapore Dollar"),
        ("SHP", "Saint Helena Pound"),
        ("SLL", "Sierra Leonean Leone"),
        ("SOS", "Somali Shilling"),
        ("SRD", "Surinamese Dollar"),
        ("SZL", "Swazi Lilangeni"),
        ("THB", "Thai Baht"),
        ("TND", "Tunisian Dinar"),
        ("TOP", "Tongan Paʻanga"),
        ("TRY", "Turkish Lira"),
        ("TTD", "Trinidad and Tobago Dollar"),
        ("TWD", "New Taiwan Dollar"),
        ("TZS", "Tanzanian Shilling"),
        ("UAH", "Ukrainian Hryvnia"),
        ("UGX", "Ugandan Shilling"),
        ("USD", "US Dollar"),
        ("UYU", "Uruguayan Peso"),
        ("UZS", "Uzbekistani Som"),
        ("VND", "Vietnamese Dong"),
        ("XAF", "CFA Franc BEAC"),
        ("XCD", "East Caribbean Dollar"),
        ("XOF", "CFA Franc BCEAO"),
        ("XPF", "CFP Franc"),
        ("ZAR", "South African Rand"),
        ("ZMW", "Zambian Kwacha"),
    ]

    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=320)
    main_currency = models.CharField(max_length=10, choices=CURRENCIES, default="USD")

    def __str__(self):
        return self.username

class Currency(models.Model):
    # Will implement this soon :)
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
    currency = models.CharField(max_length=30, choices=User.CURRENCIES, default="USD")
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
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
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_id = models.ForeignKey(Account, on_delete=models.CASCADE)
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.IntegerField()
    description = models.TextField()
    date = models.DateField()
    currency = models.CharField(max_length=30, choices=User.CURRENCIES, default="USD")    