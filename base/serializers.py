from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Video, Like, User_profile, Follower, Comment

class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    profile_photo = serializers.ImageField(source='user_profile.profile_photo', read_only=True)
    about = serializers.CharField(source='user_profile.about', read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'first_name', 'last_name', 'email', 'isAdmin', 'profile_photo', 'about']
    
    def get__id(self, obj):
        return obj.id
    
    def get_isAdmin(self, obj):
        return obj.is_staff

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    profile_photo = serializers.ImageField(source='user_profile.profile_photo', read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'first_name', 'last_name', 'email', 'profile_photo','isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class UserProfileSerializer(UserSerializer):
    total_videos = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    is_followed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'first_name', 'last_name', 'email', 'isAdmin', 'profile_photo', 'about', 'date_joined', 'total_videos', 'followers_count', 'is_followed', 'videos',]

    def get_total_videos(self, obj):
        return Video.objects.filter(user=obj).count()

    def get_followers_count(self, obj):
        return Follower.objects.filter(followed_user=obj).count()

    def get_videos(self, obj):
        user_videos = Video.objects.filter(user=obj)
        serializer = VideoSerializer(user_videos, many=True, context=self.context)
        return serializer.data

    def get_is_followed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            logged_in_user = request.user

            if logged_in_user.following.filter(followed_user=obj).exists():
                return True

        return False

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['_id', 'video', 'user', 'username', 'profile_photo', 'comment_text', 'post_time']

    def get_username(self, obj):
        return obj.user.username if obj.user else None

    def get_profile_photo(self, obj):
        return obj.user.user_profile.profile_photo.url if (obj.user and hasattr(obj.user, 'user_profile') and obj.user.user_profile.profile_photo) else None

class VideoSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField(required=False)
    is_disliked = serializers.SerializerMethodField(required=False)
    is_followed = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = '__all__'

    def get_username(self, obj):
        return obj.user.username if obj.user else None

    def get_profile_photo(self, obj):
        if obj.user and hasattr(obj.user, 'user_profile'):
            return obj.user.user_profile.profile_photo.url if obj.user.user_profile.profile_photo else None
        return None

    def get_user_id(self, obj):
        return obj.user.id if obj.user else None

    def get_is_liked(self, obj):
        include_extra_details = self.context.get('include_extra_details', False)
        if include_extra_details:
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                user = request.user
                try:
                    like = Like.objects.get(user=user, video=obj)
                    return like.like
                except Like.DoesNotExist:
                    return False
        return None

    def get_is_disliked(self, obj):
        include_extra_details = self.context.get('include_extra_details', False)
        if include_extra_details:
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                user = request.user
                try:
                    dislike = Like.objects.get(user=user, video=obj, like=False)
                    return True
                except Like.DoesNotExist:
                    return False
        return None

    def get_is_followed(self, obj):
        include_extra_details = self.context.get('include_extra_details', False)
        if include_extra_details:
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                user = request.user
                video_user = obj.user
                if user.following.filter(followed_user=video_user).exists():
                    return True
        return False

    def get_total_comments(self, obj):
        return Comment.objects.filter(video=obj).count()