from django.http import HttpResponse


def index(request):
    return HttpResponse("!!! THIS IS JUST THE BEGINNING !!!")
