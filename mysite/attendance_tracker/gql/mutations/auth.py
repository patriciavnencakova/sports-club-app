import graphene
from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError

from ..types import MemberType
from ...models import Account, Member


class RegistrationMutation(graphene.Mutation):
    class Arguments:
        first_name = graphene.String()
        last_name = graphene.String()
        birth_date = graphene.Date()
        email = graphene.String()
        password = graphene.String()
        confirm_password = graphene.String()

    member = graphene.Field(MemberType, required=True)

    def mutate(
        root, info, first_name, last_name, birth_date, email, password, confirm_password
    ):
        if password != confirm_password:
            raise GraphQLError("Heslá sa nezhodujú.")

        try:
            account = Account.objects.get(email=email)
            if account.is_registered:
                raise GraphQLError(f"Účet s emailom {email} je už registrovaný.")
        except ObjectDoesNotExist:
            raise GraphQLError("Nemáš právo sa registrovať.")

        member = Member.objects.create(
            team=account.team,
            first_name=first_name,
            last_name=last_name,
            birth=birth_date,
            email=email,
            # password=password
        )
        account.password = password
        account.is_registered = True
        account.save()
        return RegistrationMutation(member=member)
