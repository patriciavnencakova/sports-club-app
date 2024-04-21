from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("graphql", csrf_exempt(GraphQLView.as_view(graphiql=True))),
    path("registration/", views.registration, name="registration"),
    # path("pos/", views.pos, name="pos"),
    path("login/", views.login, name="login"),
    # path('admin_page/', views.admin_page, name="admin_page"),
]
