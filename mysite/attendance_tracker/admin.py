from django.contrib import admin

from .models import Account, Team, Role, Member

admin.site.register(Account)
admin.site.register(Team)
admin.site.register(Role)
admin.site.register(Member)