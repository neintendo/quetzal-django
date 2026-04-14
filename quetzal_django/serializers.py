from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import Account, Category, Transaction, User

# Users


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "display_name", "main_currency"]


# User Registration Serializer.
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "display_name",
            "password",
            "main_currency",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Extract password from validated_data
        password = validated_data.pop("password", None)

        # Create user without password first
        user = User.objects.create(**validated_data)

        # Set password using set_password method (hashes the pass)
        if password:
            user.set_password(password)
            user.save()

        return user


# User Login Serializer.
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    # Validation method for logging in :)
    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    attrs["user"] = user
                    return attrs
                else:
                    raise serializers.ValidationError("User Account Is Disabled.")
            else:
                raise serializers.ValidationError(
                    "Unable to login with the provided credentials."
                )
        else:
            raise serializers.ValidationError("Must include 'username' & 'password'.")


# Account Serializer.
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = "__all__"
        read_only_fields = ("user", "balance")
        extra_kwargs = {"currency": {"required": True}}


# Category Serializer.
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = ("user", "id")


# Transaction Serializer.
class TransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(write_only=True)
    destination_account_name = serializers.CharField(write_only=True, required=False)
    category_name = serializers.CharField(write_only=True)
    account = serializers.CharField(read_only=True)  # displays account name
    destination_account = serializers.CharField(
        read_only=True
    )  # displays destination account name
    category = serializers.CharField(read_only=True)  # displays category name
    datetime = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Transaction
        fields = [
            "id",
            "amount",
            "description",
            "notes",
            "datetime",
            "currency",
            "account_name",  # Used for transfers
            "destination_account_name",  # Used for transfers
            "category_name",
            "account",
            "destination_account",
            "category",
            "transaction_type",
        ]
        read_only_fields = ("user",)
        extra_kwargs = {
            "transaction_type": {"required": True},
            "currency": {"required": False},
            "notes": {"required": False},
        }

    def validate(self, attrs):
        # Validate amount
        if attrs.get("amount") <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")

        # Validation checks for transfers
        if attrs.get("transaction_type") == "transfer":
            # Prevent transfers to the same account
            if attrs.get("account_name") == attrs.get("destination_account_name"):
                raise serializers.ValidationError("Cannot transfer to the same account")

        return attrs

    def create(self, validated_data):
        # Get the current user from the request context
        request = self.context.get("request")
        user = request.user
        transaction_type = validated_data.get("transaction_type")
        transfer_currency = validated_data.get("currency")

        # Extract account and category names from validated data
        account_name = validated_data.pop("account_name")
        destination_account_name = validated_data.pop("destination_account_name", None)
        category_name = validated_data.pop("category_name")

        # Get or create origin account
        origin_account, _ = Account.objects.get_or_create(
            name=account_name, user=user, currency=transfer_currency
        )

        # Get or create destination account (for transfers)
        destination_account = None
        if transaction_type == "transfer" and destination_account_name:
            destination_account, _ = Account.objects.get_or_create(
                name=destination_account_name,
                user=user,
                defaults={
                    "type": origin_account.type,
                    "currency": origin_account.currency,
                },
            )

        # If accounts have different currencies display error message
        if transaction_type == "transfer" and destination_account:
            if origin_account.currency != destination_account.currency:
                raise serializers.ValidationError(
                    "Cannot transfer between accounts with different currencies"
                )

        # Get or create category (_ is a placeholder value)
        category, _ = Category.objects.get_or_create(
            name=category_name, user=user, defaults={"type": transaction_type}
        )

        # Automatically inherits the currency from the account being used
        validated_data["currency"] = origin_account.currency

        # Create the transaction - only set destination_account for transfers
        transaction_data = {
            "user": user,
            "account": origin_account,
            "category": category,
            **validated_data,
        }
        # Only add destination_account if it's a transfer and destination_account exists
        if transaction_type == "transfer" and destination_account:
            transaction_data["destination_account"] = destination_account

        transaction = Transaction.objects.create(**transaction_data)

        return transaction

    def update(self, instance, validated_data):

        account_name = validated_data.pop("account_name", None)
        destination_account_name = validated_data.pop("destination_account_name", None)
        category_name = validated_data.pop("category_name", None)

        if account_name:
            instance.account, _ = Account.objects.get_or_create(
                name=account_name, user=self.context["request"].user
            )
        if destination_account_name:
            instance.destination_account, _ = Account.objects.get_or_create(
                name=destination_account_name, user=self.context["request"].user
            )
        if category_name:
            instance.category, _ = Category.objects.get_or_create(
                name=category_name, user=self.context["request"].user
            )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def to_representation(self, instance):
        # Custom representation to show names instead of IDs
        representation = super().to_representation(instance)
        # Replaces the account and category fields with their names
        representation["account"] = instance.account.name if instance.account else None
        representation["destination_account"] = (
            instance.destination_account.name if instance.destination_account else None
        )
        representation["category"] = (
            instance.category.name if instance.category else None
        )
        return representation
