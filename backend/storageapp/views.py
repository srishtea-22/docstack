from django.shortcuts import render, redirect
from django.contrib.auth import logout

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello(request):
    return Response({"message": "hello from djangooooooo"})

def home(request):
    return redirect('http://localhost:3000')

def logout_view(request):
    logout(request)
    return redirect('http://localhost:3000')