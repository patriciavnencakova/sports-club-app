import graphene
from graphql import GraphQLError
from graphql_auth.queries import UserQuery, MeQuery
from graphql_auth import mutations
from graphql_auth.decorators import login_required

from .mutations.vote import VoteMutation

# TODO: Fix relative models.XXX
from .. import models
from .mutations.auth import RegistrationMutation
from .types import EventType, VoteType


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
    vote = graphene.List(VoteType, id=graphene.NonNull(graphene.Int))
    # event_votes = graphene.Field(EventVotesType, id=graphene.NonNull(graphene.Int))

    # def resolve_members(root, info):
    #     return models.Member.objects.all()

    @classmethod
    @login_required
    def resolve_events(cls, root, info, **kwargs):
        id = kwargs.get("id")
        user = info.context.user
        team = user.team
        events = models.Event.objects.filter(team=team)

        if id is not None:
            if id not in [event.id for event in events]:
                raise GraphQLError("Nemáš právo na túto akciu.")
            events = events.filter(id=id)

        return events

    @classmethod
    @login_required
    def resolve_vote(cls, root, info, **kwargs):
        id = kwargs.get("id")
        user = info.context.user
        queryset = models.Vote.objects.filter(member=user)

        if id is not None:
            queryset = queryset.filter(event_id=id)

        return queryset

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


schema = graphene.Schema(query=Query, mutation=Mutation)
