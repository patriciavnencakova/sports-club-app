import graphene
from graphene import relay, ObjectType
from graphene_django import DjangoObjectType

from .. import models


class MemberType(DjangoObjectType):
    class Meta:
        model = models.Member
        fields = "__all__"


class EventType(DjangoObjectType):
    coming = graphene.List(MemberType, required=True)
    not_coming = graphene.List(MemberType, required=True)
    not_responded = graphene.List(MemberType, required=True)

    class Meta:
        model = models.Event
        fields = "__all__"

    def resolve_coming(self, info):
        return models.Member.objects.filter(vote__event_id=self.id, vote__response=True).distinct()

    def resolve_not_coming(self, info):
        return models.Member.objects.filter(vote__event_id=self.id, vote__response=False).distinct()

    def resolve_not_responded(self, info):
        team = self.team
        total_members = models.Member.objects.filter(team=team)
        responded_members = models.Member.objects.filter(vote__event_id=self.id).distinct()
        return total_members.exclude(pk__in=responded_members)


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


# class EventVotesType(ObjectType):
#     coming = graphene.Int(required=True)
#     not_coming = graphene.Int(required=True)
#     question = graphene.Int(required=True)
