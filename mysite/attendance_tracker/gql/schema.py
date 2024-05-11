import graphene
from graphql import GraphQLError
from graphql_auth.queries import UserQuery, MeQuery
from graphql_auth import mutations
from graphql_auth.decorators import login_required

from django.db.models import Subquery

from .mutations.add_account import AddAccountMutation
from .mutations.edit_event import EditEventMutation
from .mutations.vote import VoteMutation

# TODO: Fix relative models.XXX
from .. import models
from .mutations.auth import RegistrationMutation
from .types import EventtType, VoteType, RoleType, EventTypeType, MemberType, AccountType


class AuthMutation(graphene.ObjectType):
    registration = RegistrationMutation.Field()
    # register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()


class Query(UserQuery, MeQuery, graphene.ObjectType):
    events = graphene.List(EventtType, id=graphene.Int())
    vote = graphene.Field(VoteType, event_id=graphene.NonNull(graphene.Int))
    role = graphene.Field(RoleType)
    event_types = graphene.List(EventTypeType)
    players = graphene.List(MemberType)
    coaches = graphene.List(MemberType)
    not_registered = graphene.List(AccountType)
    role_types = graphene.List(RoleType)
    # event_votes = graphene.Field(EventVotesType, id=graphene.NonNull(graphene.Int))

    @classmethod
    @login_required
    def resolve_events(cls, root, info, **kwargs):
        id = kwargs.get("id")
        user = info.context.user
        team = user.team
        events = models.Event.objects.filter(team=team).order_by('date')

        if id is not None:
            if id not in [event.id for event in events]:
                raise GraphQLError("Nemáš právo na túto akciu.")
            events = events.filter(id=id)

        return events

    @classmethod
    @login_required
    def resolve_vote(cls, root, info, **kwargs):
        event_id = kwargs.get("event_id")
        user = info.context.user
        return models.Vote.objects.filter(member=user, event_id=event_id).last()

    @classmethod
    @login_required
    def resolve_role(cls, root, info, **kwargs):
        user = info.context.user
        return models.Account.objects.get(email=user.email).role

    @classmethod
    @login_required
    def resolve_event_types(cls, root, info, **kwargs):
        return models.EventType.objects.all()

    @classmethod
    @login_required
    def resolve_players(cls, root, info, **kwargs):
        user = info.context.user
        players = models.Account.objects.filter(role__description="hráč", team=user.team).values('email')
        return models.Member.objects.filter(email__in=Subquery(players))

    @classmethod
    @login_required
    def resolve_coaches(cls, root, info, **kwargs):
        user = info.context.user
        coaches = models.Account.objects.filter(role__description="tréner", team=user.team).values('email')
        return models.Member.objects.filter(email__in=Subquery(coaches))

    @classmethod
    @login_required
    def resolve_not_registered(cls, root, info, **kwargs):
        user = info.context.user
        return models.Account.objects.filter(team=user.team, is_registered=False)

    @classmethod
    @login_required
    def resolve_role_types(cls, root, info, **kwargs):
        return models.Role.objects.all()


    # @classmethod
    # @login_required
    # def resolve_event_votes(cls, root, info, **kwargs):
    #     id = kwargs.get("id")
    #     user = info.context.user
    #     event = models.Event.objects.get(id=id)
    #     team = models.Team.objects.get(id=event.team_id)
    #
    #     if user.team != team:
    #         raise GraphQLError("Nemáš právo.")
    #
    #     coming = models.Vote.objects.filter(event_id=id, response=True).count()
    #     not_coming = models.Vote.objects.filter(event_id=id, response=False).count()
    #     question = models.Member.objects.all().filter(team=team).count() - coming - not_coming
    #
    #     # TODO: Why IDE suggests that arguments are unexpected?
    #     return EventVotesType(
    #         coming=coming,
    #         not_coming=not_coming,
    #         question=question
    #     )


class Mutation(AuthMutation, graphene.ObjectType):
    vote = VoteMutation.Field()
    edit_event = EditEventMutation.Field()
    add_account = AddAccountMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
