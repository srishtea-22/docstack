from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('storageapp.urls')),
    path('accounts/', include('allauth.urls'))
]
