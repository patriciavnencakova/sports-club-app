from django.db import models


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


class Account(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=50)
    is_registered = models.BooleanField(default=False)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    def __str__(self):
        return self.email


class Member(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    birth = models.DateField()
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email


class Event(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    location = models.CharField(max_length=50)
    date = models.DateField()


class MembershipFee(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    has_paid = models.BooleanField(default=False)
    date = models.DateField()


class EventMember(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    response = models.BooleanField()
