from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Video)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(User_profile)
admin.site.register(Follower)