from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.decorators import authentication_classes

from .models import User, Account, Category, Transaction

# Users

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'main_currency']

# User Registration Serializer.
class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'main_currency']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            main_currency=validated_data.get('main_currency', 'USD')
        )
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