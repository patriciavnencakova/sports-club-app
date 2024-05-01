import graphene
from graphql_auth.constants import Messages
from graphql_auth.exceptions import GraphQLAuthError
from graphql_auth.queries import UserQuery, MeQuery
from graphql_auth import mutations
from graphql_auth.decorators import login_required

from .mutations.vote import VoteMutation
from .. import models
from .mutations.auth import RegistrationMutation
from .types import MemberType, EventType, VoteType


class AuthMutation(graphene.ObjectType):
    registration = RegistrationMutation.Field()
    # register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()


class Query(UserQuery, MeQuery, graphene.ObjectType):
    # members = graphene.List(MemberType)
    events = graphene.List(EventType, id=graphene.Int())
    vote = graphene.List(VoteType, id=graphene.Int())

    # def resolve_members(root, info):
    #     return models.Member.objects.all()

    @classmethod
    @login_required
    def resolve_events(cls, root, info, **kwargs):
        id = kwargs.get("id")
        print(info.context.user)
        user = info.context.user
        queryset = models.Event.objects.filter(team=user.team)

        if id is not None:
            queryset = queryset.filter(id=id)

        return queryset

    @classmethod
    @login_required
    def resolve_vote(cls, root, info, **kwargs):
        id = kwargs.get("id")
        print(info.context.user)
        user = info.context.user
        queryset = models.Vote.objects.filter(member=user)

        if id is not None:
            queryset = queryset.filter(event_id=id)

        return queryset


class Mutation(AuthMutation, graphene.ObjectType):
    vote = VoteMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
