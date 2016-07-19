from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from .models import *
from person.models import Person
from challenge.models import *
from news.views import submit_news
from .forms import *
from datetime import timedelta
import json


OKAY = HttpResponse(
    json.dumps({'msg': 'okay'}),
    content_type='application/json')

FAIL = HttpResponse(
    json.dumps({'msg': 'fail'}),
    content_type='application/json')

ERROR = HttpResponse(
    json.dumps({'msg': 'error'}),
    content_type='application/json')


def index(request):
    if request.session.get('uid', None):
        user = Person.objects.get(pk=request.session['uid'])
    else:
        user = None
    username = user.username if user else None
    writeups = Writeup.objects.all()
    for item in writeups:
        item.like = item.likes.count()
        item.comment = item.comments.count()
        item.group = item.author.group.name if item.author.group else ''
        item.writer = item.author.username
        item.category = item.challenge.category
        item.solve = item.challenge.title
    writeups = sorted(writeups, key=lambda x: x.like, reverse=True)
    mywp = sorted(filter(lambda x: x.writer == username, writeups),
                  key=lambda x: x.time, reverse=False)
    starredwp = user.stars.all()
    for item in starredwp:
        item.like = item.likes.count()
        item.comment = item.comments.count()
        item.group = item.author.group.name if item.author.group else ''
        item.writer = item.author.username
        item.solve = item.challenge.title
    return render(request, 'writeup.jade', {
        'username': username,
        'writeups': writeups,
        'mywp': mywp,
        'starredwp': starredwp,
        'minelen': len(mywp),
        'starredlen': len(starredwp),
    })


def comment(request, pk): pass


def like(request, pk): pass


def unlike(request, pk): pass


def star(request, pk): pass


def unstar(request, pk): pass


def editor(request, pk='-1'):
    if request.session.get('uid', None):
        user = Person.objects.get(pk=request.session['uid'])
    else:
        user = None
    username = user.username if user else None
    sources = map(lambda x: x.title, Source.objects.all())
    pk = int(pk)
    if pk == -1:
        return render(request, 'writeup-editor.jade', {
            'username': username,
            'sources': sources,
        })
    else:
        try:
            wp = Writeup.objects.get(pk=pk)
        except:
            return render(request, '404.jade')
        if wp.author != user:
            return render(request, '404.jade')
        return render(request, 'writeup-editor.jade', {
            'username': username,
            'content': wp.content,
            'challenge': wp.challenge.pk,
            'title': wp.title
        })


@csrf_exempt
def upload_image(request):
    if request.is_ajax:
        iform = ImageForm(request.POST, request.FILES)
        if iform.is_valid():
            img = request.FILES['img']
            if img.size > 5 * 1024 * 1024:
                return HttpResponse(
                    json.dumps(
                        {'msg': 'Image No Larger Than 5M is Accepted.'}),
                    content_type='application/json'
                )
            from os import urandom
            from base64 import b64encode
            filename = b64encode(urandom(12)).replace('/', '=')
            filepath = settings.MEDIA_ROOT + 'image/' + filename
            with open(filepath, 'wb+') as dest:
                for chunk in img.chunks():
                    dest.write(chunk)
            return HttpResponse(json.dumps({
                'msg': 'okay',
                'path': settings.MEDIA_URL + 'image/' + filename
            }), content_type='application/json')
        return FAIL
    return ERROR


def get_challenges(request):
    if request.is_ajax:
        sf = SourceForm(request.POST)
        if sf.is_valid():
            title = sf.cleaned_data['title']
            challenges = map(lambda x: {'pk': x.pk, 'name': x.title},
                             Challenge.objects.filter(source=title))
            return HttpResponse(json.dumps({
                'msg': 'okay',
                'challenges': challenges
            }),content_type='application/json')
        return FAIL
    return ERROR


def submit(request):
    if request.is_ajax:
        wf = WriteupForm(request.POST)
        if wf.is_valid():
            try:
                title = wf.cleaned_data['title']
                challenge = Challenge.objects.get(pk=wf.cleaned_data['challenge'])
                content = wf.cleaned_data['content']
                wp, _ = Writeup.objects.update_or_create(
                    author=Person.objects.get(pk=request.session['uid']),
                    challenge=challenge,
                    defaults={
                        'title': title,
                        'content': content
                    }
                )
                return HttpResponse(json.dumps({
                    'msg': 'okay',
                    'pk': wp.pk
                }), content_type='application/json')
            except:
                return FAIL
    return ERROR


def detail(request, pk):
    if request.session.get('uid', None):
        user = Person.objects.get(pk=request.session['uid'])
    else:
        user = None
    username = user.username if user else None
    # try:
    if True:
        wp = Writeup.objects.get(pk=int(pk))
        comments = Comment.objects.filter(writeup=wp).order_by('-time')
        for item in comments:
            item.avatar = item.author.avatar
            item.writer = item.author.username
            if item.reply:
                item.recver = item.reply.username
            item.pk = item.author.pk
            item.timex = (item.time + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S')
        my_wp = Writeup.objects.filter(author=wp.author).exclude(pk=wp.pk)
        re_wp = Writeup.objects.filter(challenge=wp.challenge).exclude(pk=wp.pk)
        for item in my_wp:
            item.like = item.likes.count()
        for item in re_wp:
            item.like = item.likes.count()
        return render(request, 'writeup-detail.jade', {
            'username': username,
            'title': wp.title,
            'content': wp.content,
            'author': wp.author.username,
            'authorid': wp.author.pk,
            'avatar': user.avatar,
            'like': wp.likes.count(),
            'star': wp.stars.count(),
            'comments': comments,
            'my_wp': my_wp,
            're_wp': re_wp
        })
    # except:
    else:
        return render(request, '404.jade')


def comment(request):
    if request.is_ajax:
        cf = CommentForm(request.POST)
        if cf.is_valid():
            # try:
            if True:
                comment = Comment.objects.create(
                    author=Person.objects.get(pk=request.session['uid']),
                    writeup=Writeup.objects.get(pk=cf.cleaned_data['writeup']),
                    content=cf.cleaned_data['content']
                )
                reply = cf.cleaned_data['reply']

                if reply:
                    comment.reply = Person.objects.get(pk=reply)
                    comment.save()
                return OKAY
            # except:
            else:
                return FAIL
    return ERROR
