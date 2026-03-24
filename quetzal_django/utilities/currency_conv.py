from datetime import datetime

import requests

from ..models import ExchangeRates


def conversion(amount, base_currency, target_currency, transaction_date):

    today = datetime.today().strftime("%Y-%m-%d")

    if transaction_date.strftime("%Y-%m-%d") > today:
        raise ValueError(
            "Date of transfers cannot be in the future between accounts with different currencies"
        )

    if ExchangeRates.objects.filter(date=transaction_date, base=base_currency).exists():
        print("{0} for {1} EXISTS".format(base_currency, transaction_date))
        rates_obj = ExchangeRates.objects.get(date=transaction_date, base=base_currency)
        rates = rates_obj.rates
        multiplier = rates.get(target_currency)

    else:
        try:
            print("{0} for {1} DOES NOT EXIST".format(base_currency, transaction_date))
            url = (
                "https://api.frankfurter.dev/v1/"
                + transaction_date.strftime("%Y-%m-%d")
                + "?base="
                + base_currency.upper()
            )
            response = requests.get(url)

            if response.status_code != 200:
                print("API Returned Error:", response.status_code)
                return

            data = response.json()
            rates_n = data.get("rates", {})

            try:
                ExchangeRates.objects.create(
                    date=transaction_date, base=base_currency, rates=rates_n
                )
                print(
                    "{0} for {1} CREATE SUCCESS".format(base_currency, transaction_date)
                )
            except Exception as e:
                print("ERROR:", e)
                return

            multiplier = rates_n[target_currency.upper()]

        except Exception as e:
            print("Error: {0}".format(e))
            return

    # Convert the currency
    amount = float(amount)
    amount *= multiplier
    return amount
