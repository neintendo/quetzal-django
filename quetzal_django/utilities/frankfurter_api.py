import json
from datetime import datetime

import requests


# Handles same day currency conversions
def ff_today_func(base_path):

    # Checks cache for rates
    try:
        with open(base_path, "r") as base_cache:
            cache = json.load(base_cache)
        return cache

    except FileNotFoundError as file_err:
        print("FILE NOT FOUND:", file_err)

        # Tries to fetch up to date rates again
        cache_rates("quetzal_django/utilities/frankfurter_cache/")
        try:
            with open(base_path, "r") as base_cache:
                cache = json.load(base_cache)
            return cache

        # Prints any other errors
        except Exception as file_err:
            print("ERROR:", file_err)
            return


# Handles historical currency conversions
def ff_historical_func(transaction_date, base_currency):
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

        return response

    # Return none on error
    except Exception as e:
        print("Connection Error: {0}".format(e))
        return


def cache_rates(path):

    currencies = [
        "AUD",
        "BRL",
        "CAD",
        "CHF",
        "CNY",
        "CZK",
        "DKK",
        "EUR",
        "GBP",
        "HKD",
        "HUF",
        "IDR",
        "ILS",
        "INR",
        "ISK",
        "JPY",
        "KRW",
        "MXN",
        "MYR",
        "NOK",
        "NZD",
        "PHP",
        "PLN",
        "RON",
        "SEK",
        "SGD",
        "THB",
        "TRY",
        "USD",
        "ZAR",
    ]

    for sym in currencies:
        new_path = "{0}{1}.json".format(path, sym.lower())

        try:
            url = "https://api.frankfurter.dev/v1/latest?base=" + sym
            response = requests.get(url)
            try:
                with open(new_path, "w") as base_cache:
                    json.dump(response.json(), base_cache)
            except Exception as write_err:
                print("FILE WRITE ERROR:", write_err)
                return

        # Return none on error
        except Exception as e:
            print("Connection Error: {0}".format(e))
            return

    date_tracker = path + "date_tracker.txt"
    today = datetime.today().strftime("%Y-%m-%d")

    # Overwrites date_tracker.txt on success with current date
    try:
        with open(date_tracker, "w") as date_file:
            date_file.write(today)

    except Exception as write_err:
        print("FILE WRITE ERROR:", write_err)
        return
