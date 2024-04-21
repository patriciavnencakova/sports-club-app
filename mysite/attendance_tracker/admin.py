from django.contrib import admin

from .models import Account, Team, Role, Member, Event, EventType, Vote

admin.site.register(Account)
admin.site.register(Team)
admin.site.register(Role)
admin.site.register(Member)
admin.site.register(Event)
admin.site.register(EventType)
admin.site.register(Vote)
