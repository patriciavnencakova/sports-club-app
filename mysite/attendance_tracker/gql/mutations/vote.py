import graphene
from ..types import VoteType
from ...models import Vote


class VoteMutation(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID(required=True)
        response = graphene.Boolean(required=True)
        comment = graphene.String()

    vote = graphene.Field(VoteType, required=True)

    @staticmethod
    def mutate(root, info, event_id, response, comment=None):
        vote = Vote.objects.create(
            member_id=info.context.user.id, event_id=event_id, response=response, comment=comment
        )
        return VoteMutation(vote=vote)
