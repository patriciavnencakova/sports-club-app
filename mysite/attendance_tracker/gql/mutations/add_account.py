import graphene
from graphql import GraphQLError
from graphql_auth.decorators import login_required

from ..types import AccountType
from ...models import Account, Role


class AddAccountMutation(graphene.Mutation):
    class Arguments:
        role = graphene.String(required=True)
        email = graphene.String(required=True)

    account = graphene.Field(AccountType, required=True)

    @classmethod
    @login_required
    def mutate(cls, root, info, **kwargs):
        role = kwargs.get('role')
        email = kwargs.get('email')

        user = info.context.user
        if Account.objects.get(email=user.email).role == 'hráč':
            raise GraphQLError("Nemáš právo na túto akciu.")
        try:
            account = Account.objects.get(email=email)
            if account:
                raise GraphQLError("Tento email už je použitý.")
        except Account.DoesNotExist:
            role_type = Role.objects.get(description=role)
            account = Account.objects.create(
                email=email,
                role=role_type,
                team=user.team,
                is_registered=False,
            )
        return AddAccountMutation(account=account)
