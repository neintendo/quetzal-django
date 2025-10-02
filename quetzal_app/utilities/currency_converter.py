import requests
from datetime import datetime


def conversion(amount, base_currency, target_currency, transaction_date):
    today = datetime.today().strftime("%Y-%m-%d")

    if transaction_date.strftime("%Y-%m-%d") > today:
        raise ValueError(
            "Date of transfers cannot be in the future between accounts with different currencies"
        )
    if today == transaction_date.strftime("%Y-%m-%d"):
        try:
            url = (
                "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@"
                + today
                + "/v1/currencies/"
                + base_currency.lower()
                + ".json"
            )
            response = requests.get(url)

        # Fallback URL
        except Exception:
            url = (
                "https://"
                + today
                + ".currency-api.pages.dev/v1/currencies/"
                + base_currency.lower()
                + ".json"
            )
            # Return None if both URLs fail
            try:
                response = requests.get(url)
            except Exception as e:
                print("Error: {0}".format(e))
                return

    elif today != transaction_date.strftime("%Y-%m-%d"):
        try:
            url = (
                "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@"
                + transaction_date.strftime("%Y-%m-%d")
                + "/v1/currencies/"
                + base_currency.lower()
                + ".json"
            )
            response = requests.get(url)

        # Fallback URL
        except Exception:
            url = (
                "https://"
                + transaction_date.strftime("%Y-%m-%d")
                + ".currency-api.pages.dev/v1/currencies/"
                + base_currency.lower()
                + ".json"
            )
            # Return None if both URLs fail
            try:
                response = requests.get(url)
            except Exception as e:
                print("Error: {0}".format(e))
                return

    # Parsing the request to dictionary
    data = response.json()

    # Access exchange rate for the target currency based on base_currency
    multiplier = data[base_currency.lower()][target_currency.lower()]
    # Convert the currency
    amount *= multiplier
    return round(amount, 2)


# for testing only
date_obj = datetime(2025, 10, 1)
print(conversion(15, "USD", "ZAR", date_obj))
