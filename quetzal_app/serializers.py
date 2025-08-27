from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Account, Category, Transaction

# Users

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'main_currency']

# User Registration Serializer.
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'main_currency']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Extract password from validated_data
        password = validated_data.pop('password', None)

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
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                    return data
                else:
                    raise serializers.ValidationError("User Account Is Disabled.")
            else:
                raise serializers.ValidationError("Unable to login with the provided credentials.")
        else:
            raise serializers.ValidationError("Must include 'username' & 'password'.")

# Account Serializer.
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        read_only_fields = ('user', 'balance')
        extra_kwargs = {
            'currency': {'required': True}
        }

# Category Serializer.
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('user',)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Replace the internal type value with the human-readable display value
        representation['type'] = instance.get_type_display()
        return representation

# Transaction Serializer.
class TransactionSerializer(serializers.ModelSerializer):

    account_name = serializers.CharField(write_only=True)
    destination_account_name = serializers.CharField(write_only=True, required=False)
    category_name = serializers.CharField(write_only=True)
    account = serializers.CharField(read_only=True)  # displays account name
    destination_account = serializers.CharField(read_only=True) # displays destination account name
    category = serializers.CharField(read_only=True)  # displays category name
    datetime = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'description', 'datetime', 'currency', 'account_name',
                  'destination_account_name', 'category_name', 'account', 'destination_account', 'category', 'transaction_type']
        read_only_fields = ('user',)
        extra_kwargs = {
            'transaction_type': {'required': True},
            'currency': {'required': True}
        }

    # Validation to check if origin & destination accounts exists
    def validate(self, data):
        transaction_type = data.get('transaction_type')

        if transaction_type == 'transfer':
            if not data.get('account_name'):
                raise serializers.ValidationError("Origin account is required for transfers.")
            if not data.get('destination_account_name'):
                raise serializers.ValidationError("Destination account is required for transfers.")
        else:
                """For non-transfers, require account_name instead of destination_account_name"""
                if not data.get('account_name'):
                    raise serializers.ValidationError("An account is required.")

        return data

    def create(self, validated_data):
        # Get the current user from the request context
        request = self.context.get('request')
        user = request.user
        transaction_type = validated_data.get('transaction_type')

        # Extract account and category names from validated data
        account_name = validated_data.pop('account_name')
        destination_account_name = validated_data.pop('destination_account_name', None)
        category_name = validated_data.pop('category_name')

        # Get or create origin account
        origin_account, _ = Account.objects.get_or_create(
            name=account_name,
            user=user,
            defaults={
                'type': 'bank',  # Default account type
                'currency': user.main_currency  # Use user's main currency
            }
        )

        # Get or create destination account (for transfers)
        destination_account = None
        if transaction_type == 'transfer' and destination_account_name:
            destination_account, _ = Account.objects.get_or_create(
                name=destination_account_name,
                user=user,
                defaults={
                    'type': 'bank',
                    'currency': user.main_currency
                }
            )

        # Get or create category (_ is a placeholder value)
        category, _ = Category.objects.get_or_create(
            name=category_name,
            user=user,
            defaults={'type': transaction_type}
        )

        # Create the transaction - only set destination_account for transfers
        transaction_data = {
            'user': user,
            'account': origin_account,
            'category': category,
            **validated_data
        }
        # Only add destination_account if it's a transfer and destination_account exists
        if transaction_type == 'transfer' and destination_account:
            transaction_data['destination_account'] = destination_account

        transaction = Transaction.objects.create(**transaction_data)

        return transaction

    def to_representation(self, instance):
        # Custom representation to show names instead of IDs
        representation = super().to_representation(instance)
        # Replaces the account and category fields with their names
        representation['account'] = instance.account.name if instance.account else None
        representation['destination_account'] = instance.destination_account.name if instance.destination_account else None
        representation['category'] = instance.category.name if instance.category else None
        return representation