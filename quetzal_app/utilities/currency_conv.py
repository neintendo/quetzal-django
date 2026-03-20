from datetime import datetime

from .frankfurter_api import cache_rates, ff_historical_func, ff_today_func


def conversion(amount, base_currency, target_currency, transaction_date):

    today = datetime.today().strftime("%Y-%m-%d")
    print(today)
    base_path = (
        "quetzal_app/utilities/frankfurter_cache/" + base_currency.lower() + ".json"
    )
    if transaction_date.strftime("%Y-%m-%d") > today:
        raise ValueError(
            "Date of transfers cannot be in the future between accounts with different currencies"
        )

    # Today's rates conversion
    if today == transaction_date.strftime("%Y-%m-%d"):
        try:
            with open(
                "quetzal_app/utilities/frankfurter_cache/date_tracker.txt", "r"
            ) as date_cmp:
                # Downloads and caches new rates if date_tracker.txt is older than today()
                if today != date_cmp.read():
                    cache_rates("quetzal_app/utilities/frankfurter_cache/")
                    response = ff_today_func(base_path)
                else:
                    response = ff_today_func(base_path)

        except Exception as read_err:
            print("FILE ERROR", read_err)
            return

    # Historical rates conversion
    elif today != transaction_date.strftime("%Y-%m-%d"):
        response = ff_historical_func(transaction_date, base_currency)

    data_type = type(response).__name__  # Get type name as string

    match data_type:
        case "dict":
            # Cached request
            data = response
        case "Response":
            # Parsing .json the request to dictionary
            data = response.json()

    # Access exchange rate multiplier for the target currency based on base_currency
    multiplier = data["rates"][target_currency.upper()]

    # Convert the currency
    amount = float(amount)
    amount *= multiplier
    return amount


# DEVELOPMENT

# transaction_dates = datetime.today()
# print(conversion(4539, "zar", "usd", transaction_dates))
