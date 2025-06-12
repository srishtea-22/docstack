from django.urls import path
from .views import hello, home, logout_view

urlpatterns = [
    path('hello/', hello),
    path('', home),
    path('logout', logout_view)
]