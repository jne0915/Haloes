# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from django.contrib.sessions.models import Session
from person.models import Person
import json


class Command(BaseCommand):
    def handle(self, *args, **options):
        for item in Session.objects.all():
            dic = item.get_decoded()
            if 'uid' in dic:
                print item.session_key, dic.get('key', '*'*32), dic['uid']
            # self.stdout.write(item.get_decoded())
            # pk = json.loads(item.get_decoded()).get('uid', None)
            # if pk:
            #     person = Person.objects.get(pk=pk)
            #     self.stdout.write('%s: %s' % (item.session_key, person.username.decode('utf-8')))
