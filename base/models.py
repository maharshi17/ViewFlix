from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Video(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    video_file = models.FileField(upload_to="videos", null=True, blank=True)
    thumbnail_file = models.ImageField(upload_to="thumbnails", null=True, blank=True)
    view_count = models.IntegerField(null=True, blank=True, default=0)
    like_count = models.IntegerField(null=True, blank=True, default=0)
    dislike_count = models.IntegerField(null=True, blank=True, default=0)
    upload_time = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.title

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    like = models.BooleanField(default=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.user)

class User_profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    profile_photo = models.ImageField(upload_to="profile_photos", null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.user)

class Comment(models.Model):
    video = models.ForeignKey(Video, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    comment_text = models.TextField(null=True, blank=True)
    post_time = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.comment_text

class Follower(models.Model):
    follower = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='following')
    followed_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='followers')
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.follower)