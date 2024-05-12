import graphene
from graphql import GraphQLError
from graphql_auth.decorators import login_required

from ..types import MembershipFeeType
from ...models import Account, MembershipFee
from datetime import date


class FeeMutation(graphene.Mutation):
    class Arguments:
        member_id = graphene.ID(required=True)
        has_paid = graphene.Boolean(required=True)

    fee = graphene.Field(MembershipFeeType, required=True)

    # TODO: Check how to get params in the mutate header and not from kwargs
    @classmethod
    @login_required
    def mutate(cls, root, info, **kwargs):
        member_id = kwargs.get("member_id")
        has_paid = kwargs.get("has_paid")

        user = info.context.user
        role = Account.objects.get(email=user.email).role
        if role.description == 'hráč':
            raise GraphQLError("Nemáš právo na túto akciu.")
        try:
            fee = MembershipFee.objects.get(member_id=member_id)
            fee.has_paid = has_paid
            fee.date = date.today()
            fee.save()
        except MembershipFee.DoesNotExist:
            fee = MembershipFee.objects.create(
                member_id=member_id,
                has_paid=has_paid,
                date=date.today(),
            )
        return FeeMutation(fee=fee)
