from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('registration/', views.registration, name="registration"),
    path('pos/', views.pos, name="pos"),
    path('login/', views.login, name="login")
    # path('admin_page/', views.admin_page, name="admin_page"),
]