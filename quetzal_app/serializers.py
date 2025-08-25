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

# Category Serializer.
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('user',)

# Category Serializer.
class TransactionSerializer(serializers.ModelSerializer):

    account_name = serializers.CharField(write_only=True)
    category_name = serializers.CharField(write_only=True)
    account = serializers.CharField(read_only=True)  # displays account name
    category = serializers.CharField(read_only=True)  # displays category name

    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'description', 'date', 'currency', 'account_name', 'category_name', 'account', 'category']
        read_only_fields = ('user',)

    def create(self, validated_data):
        # Get the current user from the request context
        request = self.context.get('request')
        user = request.user

        # Extract account and category names from validated data
        account_name = validated_data.pop('account_name')
        category_name = validated_data.pop('category_name')

        # Get or create the account
        account, account_created = Account.objects.get_or_create(
            name=account_name,
            user=user,
            defaults={
                'type': 'bank',  # Default account type
                'currency': user.main_currency  # Use user's main currency
            }
        )

        # Get or create the category (default to expense type)
        category, category_created = Category.objects.get_or_create(
            name=category_name,
            user=user,
            defaults={'type': 'expense'}  # Default category type
        )

        # Create the transaction
        transaction = Transaction.objects.create(
            user=user,
            account=account,
            category=category,
            **validated_data
        )

        return transaction

    def to_representation(self, instance):
        # Custom representation to show names instead of IDs
        representation = super().to_representation(instance)
        # Replaces the account and category fields with their names
        representation['account'] = instance.account.name
        representation['category'] = instance.category.name
        return representation