from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import Account, Member, Team


def index(request):
    return render(request, "attendance_tracker/home.html")