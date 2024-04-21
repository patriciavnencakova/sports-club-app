import graphene
from ..types import VoteType
from ...models import Vote


class VoteMutation(graphene.Mutation):
    class Arguments:
        memberId = graphene.ID(required=True)
        eventId = graphene.ID(required=True)
        response = graphene.Boolean(required=True)
        comment = graphene.String()

    vote = graphene.Field(VoteType, required=True)

    @staticmethod
    def mutate(root, info, memberId, eventId, response, comment=None):
        # Your logic to create a new Vote object and save it to the database
        vote = Vote.objects.create(
            member_id=memberId, event_id=eventId, response=response, comment=comment
        )
        return VoteMutation(vote=vote)
