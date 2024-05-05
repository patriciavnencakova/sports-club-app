import graphene
from graphql import GraphQLError
from graphql_auth.decorators import login_required

from ..types import VoteType
from ...models import Vote, Account


class VoteMutation(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID(required=True)
        response = graphene.Boolean(required=True)
        comment = graphene.String()

    vote = graphene.Field(VoteType, required=True)

    # TODO: Check how to get params in the mutate header and not from kwargs
    @classmethod
    @login_required
    def mutate(cls, root, info, **kwargs):
        event_id = kwargs.get("event_id")
        response = kwargs.get("response")
        comment = kwargs.get("comment")

        user = info.context.user
        role = Account.objects.get(email=user.email).role
        if role.description == 'tréner':
            raise GraphQLError("Nemáš právo na túto akciu.")
        try:
            vote = Vote.objects.get(member_id=user.id, event_id=event_id)
            vote.response = response
            vote.comment = comment
            vote.save()
        except Vote.DoesNotExist:
            vote = Vote.objects.create(
                member_id=info.context.user.id,
                event_id=event_id,
                response=response,
                comment=comment,
            )
        return VoteMutation(vote=vote)
