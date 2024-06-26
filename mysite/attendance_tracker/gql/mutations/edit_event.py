import graphene
from graphql import GraphQLError
from graphql_auth.decorators import login_required

from ..types import VoteType, EventtType
from ...models import Vote, Account, Event, EventType


class EditEventMutation(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID()
        type = graphene.String(required=True)
        date = graphene.Date(required=True)
        location = graphene.String(required=True)

    event = graphene.Field(EventtType, required=True)

    @classmethod
    @login_required
    def mutate(cls, root, info, **kwargs):
        event_id = kwargs.get('event_id')
        type = kwargs.get('type')
        date = kwargs.get('date')
        location = kwargs.get('location')

        user = info.context.user
        role = Account.objects.get(email=user.email).role
        if role.description == 'hráč':
            raise GraphQLError("Nemáš právo na túto akciu.")
        try:
            event = Event.objects.get(id=event_id)
            event_type = EventType.objects.get(description=type)
            event.type = event_type
            event.date = date
            event.location = location
            event.save()
        except Event.DoesNotExist:
            event_type = EventType.objects.get(description=type)
            event = Event.objects.create(
                team=user.team,
                type=event_type,
                location=location,
                date=date,
            )
        return EditEventMutation(event=event)
