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

# Category Serializer.
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('user',)
