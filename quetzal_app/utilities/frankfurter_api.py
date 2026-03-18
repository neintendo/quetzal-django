from datetime import datetime

import requests


def conversion(amount, base_currency, target_currency, transaction_date):
    today = datetime.today().strftime("%Y-%m-%d")

    if transaction_date.strftime("%Y-%m-%d") > today:
        raise ValueError(
            "Date of transfers cannot be in the future between accounts with different currencies"
        )
    if today == transaction_date.strftime("%Y-%m-%d"):
        try:
            url = "https://api.frankfurter.dev/v1/latest?base=" + base_currency.upper()
            response = requests.get(url)

            if response.status_code != 200:
                print("API Returned Error:", response.status_code)
                return

        # Return none on error
        except Exception as e:
            print("Connection Error: {0}".format(e))
            return

    elif today != transaction_date.strftime("%Y-%m-%d"):
        try:
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

        # Return none on error
        except Exception as e:
            print("Connection Error: {0}".format(e))
            return

    # Parsing the request to dictionary
    data = response.json()

    # Access exchange rate multiplier for the target currency based on base_currency
    multiplier = data["rates"][target_currency.upper()]

    # Convert the currency
    amount = float(amount)
    amount *= multiplier
    return amount


# DEVELOPMENT

# transaction_datse = datetime.today()
# print(conversion(4539, "eur", "usd", transaction_datse))
