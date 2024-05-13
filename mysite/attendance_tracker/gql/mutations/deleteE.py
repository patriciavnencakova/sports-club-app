import graphene
from graphql import GraphQLError
from graphql_auth.decorators import login_required

from ..types import EventtType
from ...models import Account, Event


class DeleteEventMutation(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID(required=True)

    event = graphene.Field(EventtType, required=True)

    @classmethod
    @login_required
    def mutate(cls, root, info, **kwargs):
        event_id = kwargs.get("event_id")

        user = info.context.user
        role = Account.objects.get(email=user.email).role
        if role.description == 'hráč':
            raise GraphQLError("Nemáš právo na túto akciu.")
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise GraphQLError("Udalosť neexistuje.")
        event.delete()
        return DeleteEventMutation(event=event)
