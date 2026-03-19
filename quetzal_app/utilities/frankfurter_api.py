import json

import requests


def ff_today_func(base_path, base_currency, today):
    try:
        url = "https://api.frankfurter.dev/v1/latest?base=" + base_currency.upper()
        response = requests.get(url)

        # Dumps data to cache on success
        if response.status_code == 200:
            try:
                with open(base_path, "w") as base_cache:
                    json.dump(response.json(), base_cache)

            except Exception as write_err:
                print("FILE WRITE ERROR:", write_err)
                return

            # Check cache file

        return response

    # Fallback - Return cached rate on success or None on error
    except Exception as e:
        print("Connection Error: {0} - Checking cache for rates.".format(e))
        try:
            with open(base_path, "r") as base_cache:
                cache = json.load(base_cache)
            # If cache's date is not the same as today() then return None
            if today != cache["date"]:  # INCREASE THIS TO 7 DAYS
                print("Cache is too old")
                return
            else:
                return cache

        except Exception as read_err:
            print("FILE ERROR", read_err)
            return


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
