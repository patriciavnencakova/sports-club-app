from django.db import models
from django.contrib.auth.models import AbstractUser


class Role(models.Model):
    description = models.CharField(max_length=50)

    def __str__(self):
        return self.description


class Team(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class EventType(models.Model):
    description = models.CharField(max_length=50)

    def __str__(self):
        return self.description


class Account(models.Model):
    email = models.EmailField(unique=True)
    is_registered = models.BooleanField(default=False)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    # jersey_number = models.IntegerField(null=True)

    def __str__(self):
        return self.email


class Member(AbstractUser):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True)
    birth = models.DateField(null=True)
    # mobile = models.CharField(max_length=20, null=True)

    class Meta:
        verbose_name = "member"
        verbose_name_plural = "members"
        ordering = ["id"]

    # TODO: Add validation birth/team for not staff users

    def __str__(self):
        # TODO: first name last name team
        return self.email


class Event(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    location = models.CharField(max_length=50)
    date = models.DateField()

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.team} - {self.type.description} ({self.date})"


class MembershipFee(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    has_paid = models.BooleanField(default=False)
    date = models.DateField()

    def __str__(self):
        return f"{self.member.email}"


class Vote(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    response = models.BooleanField()
    comment = models.CharField(max_length=100, null=True)

    def __str__(self):
        return f"{self.member.first_name} {self.member.last_name} - {self.event.type.description} ({self.event.date})"
