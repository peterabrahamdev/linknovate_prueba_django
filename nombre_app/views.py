
from django.shortcuts import render

def prueba_view(request):
    return render(request, 'nombre_app/challenge.html')