import graphene
from graphql import GraphQLError
from graphql_auth.decorators import login_required

from ..types import MemberType
from ...models import Account, Member


class DeleteMemberMutation(graphene.Mutation):
    class Arguments:
        member_id = graphene.ID(required=True)

    member = graphene.Field(MemberType, required=True)

    @classmethod
    @login_required
    def mutate(cls, root, info, **kwargs):
        member_id = kwargs.get("member_id")

        user = info.context.user
        role = Account.objects.get(email=user.email).role
        if role.description == 'hráč':
            raise GraphQLError("Nemáš právo na túto akciu.")
        try:
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            raise GraphQLError("Hráč neexistuje.")
        Account.objects.get(email=member.email).delete()
        member.delete()
        return DeleteMemberMutation(member=member)
