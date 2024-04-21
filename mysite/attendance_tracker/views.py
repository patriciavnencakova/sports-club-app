from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import Account, Member, Team


def index(request):
    return render(request, "attendance_tracker/home.html")


def pos(request):
    url = reverse("login")
    link_text = (
        f'Úspešne si sa zaregistroval. Prihlásiť sa môžeš <a href="{url}">sem</a>.'
    )
    return HttpResponse(link_text)


def registration(request):
    if request.method == "POST":
        email = request.POST["email"]
        password = request.POST["psswd"]
        name = request.POST["name"]
        surname = request.POST["surname"]
        birth = request.POST["birth"]
        try:
            account = Account.objects.get(email=email)
        except Account.DoesNotExist:
            return render(
                request,
                "attendance_tracker/registration.html",
                {"error_message": f"Nemáš právo sa zaregistrovať do klubu."},
            )

        if account.is_registered:
            url = reverse("login")
            error_message = f"Účet s takýmto emailom už existuje."
            return render(
                request,
                "attendance_tracker/registration.html",
                {"error_message": error_message},
            )
        account.is_registered = True
        account.password = password
        team = account.team
        member = Member(
            team=team,
            name=name,
            surname=surname,
            birth=birth,
            email=email,
            is_active=True,
        )
        account.save()
        member.save()
        return HttpResponseRedirect(reverse("pos"))
    else:
        return render(request, "attendance_tracker/registration.html")


def login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("psswd")

        try:
            account = Account.objects.get(email=email)
            if not account.is_registered or account.password != password:
                raise Account.DoesNotExist
            return HttpResponse("!!! ÚSPEŠNÉ PRIHLÁSENIE !!!")
        except Account.DoesNotExist:
            return render(
                request,
                "attendance_tracker/login.html",
                {"error_message": "Zadal si zlé údaje."},
            )
    else:
        return render(request, "attendance_tracker/login.html")
