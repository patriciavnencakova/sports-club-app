import graphene
from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError
from graphql_auth import mutations

from ..types import MemberType
from ...models import Account, Member


class RegistrationMutation(mutations.Register):
    class Arguments:
        first_name = graphene.String()
        last_name = graphene.String()
        birth_date = graphene.Date()
        email = graphene.String()

    member = graphene.Field(MemberType, required=True)

    def mutate(root, info, **input):
        # TODO: Call the super()
        try:
            account = Account.objects.get(email=input["email"])
            if input["password1"] != input["password2"]:
                raise GraphQLError(f"Heslá sa nezhodujú.")
            if account.is_registered:
                raise GraphQLError(
                    f"Účet s emailom {input['email']} je už registrovaný."
                )
        except ObjectDoesNotExist:
            raise GraphQLError("Nemáš právo sa registrovať.")

        member = Member.objects.create(
            team=account.team,
            first_name=input["first_name"],
            last_name=input["last_name"],
            username=input["username"],
            birth=input["birth_date"],
            email=input["email"],
        )
        member.set_password(input["password1"])
        member.save()
        account.is_registered = True
        account.save()
        return RegistrationMutation(member=member)
