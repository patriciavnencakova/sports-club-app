from graphene import relay
from graphene_django import DjangoObjectType

from .. import models


class MemberType(DjangoObjectType):
    class Meta:
        model = models.Member
        fields = "__all__"


class EventType(DjangoObjectType):
    class Meta:
        model = models.Event
        fields = "__all__"


class EventTypeType(DjangoObjectType):
    class Meta:
        model = models.EventType
        fields = "__all__"


class TeamType(DjangoObjectType):
    class Meta:
        model = models.Team
        fields = "__all__"


class VoteType(DjangoObjectType):
    class Meta:
        model = models.Vote
        fields = "__all__"
