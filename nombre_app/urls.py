

from django.urls import path
from .views import prueba_view

urlpatterns = [
    path('prueba/', prueba_view, name='prueba'),
]
