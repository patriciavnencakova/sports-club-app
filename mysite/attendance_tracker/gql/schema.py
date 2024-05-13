import graphene
from graphql import GraphQLError
from graphql_auth.queries import UserQuery, MeQuery
from graphql_auth import mutations
from graphql_auth.decorators import login_required

from django.db.models import Subquery

from .mutations.add_account import AddAccountMutation
from .mutations.deleteE import DeleteEventMutation
from .mutations.deleteM import DeleteMemberMutation
from .mutations.edit_event import EditEventMutation
from .mutations.fee import FeeMutation
from .mutations.vote import VoteMutation

# TODO: Fix relative models.XXX
from .. import models
from .mutations.auth import RegistrationMutation
from .types import EventtType, VoteType, RoleType, EventTypeType, MemberType, AccountType, MembershipFeeType


class AuthMutation(graphene.ObjectType):
    registration = RegistrationMutation.Field()
    verify_account = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()


class Query(UserQuery, MeQuery, graphene.ObjectType):
    events = graphene.List(EventtType, id=graphene.Int())
    vote = graphene.Field(VoteType, event_id=graphene.NonNull(graphene.Int))
    role = graphene.Field(RoleType, id=graphene.Int())
    event_types = graphene.List(EventTypeType)
    players = graphene.List(MemberType)
    coaches = graphene.List(MemberType)
    not_registered = graphene.List(AccountType)
    role_types = graphene.List(RoleType)
    reasons = graphene.List(VoteType, event_id=graphene.NonNull(graphene.Int))
    fee = graphene.Field(MembershipFeeType, id=graphene.NonNull(graphene.Int))
    logged_user = graphene.Field(MemberType)
    member = graphene.Field(MemberType, id=graphene.NonNull(graphene.Int))

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
        id = kwargs.get("id")
        if id is not None:
            email = models.Member.objects.get(id=id).email
            return models.Account.objects.get(email=email).role
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

    @classmethod
    @login_required
    def resolve_reasons(cls, root, info, **kwargs):
        id = kwargs.get("event_id")
        return models.Vote.objects.filter(response=False, event_id=id)

    @classmethod
    @login_required
    def resolve_fee(cls, root, info, **kwargs):
        id = kwargs.get("id")
        member = models.Member.objects.get(id=id)
        return models.MembershipFee.objects.get(member=member)

    @classmethod
    @login_required
    def resolve_logged_user(cls, root, info, **kwargs):
        user = info.context.user
        return models.Member.objects.get(email=user.email)

    @classmethod
    @login_required
    def resolve_member(cls, root, info, **kwargs):
        id = kwargs.get("id")
        user = info.context.user
        member_id = models.Member.objects.get(email=user.email).id
        role = models.Account.objects.get(email=user.email).role.description
        if role == 'hráč' and id != member_id:
            raise GraphQLError("Nemáš právo na túto akciu.")
        return models.Member.objects.get(id=id)


class Mutation(AuthMutation, graphene.ObjectType):
    vote = VoteMutation.Field()
    edit_event = EditEventMutation.Field()
    add_account = AddAccountMutation.Field()
    fee = FeeMutation.Field()
    delete_m = DeleteMemberMutation.Field()
    delete_e = DeleteEventMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
