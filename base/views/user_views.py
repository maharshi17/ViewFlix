import io, base64, uuid
from PIL import Image

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from django.contrib.auth.models import User
from base.models import User_profile, Follower

from base.serializers import VideoSerializer, UserSerializer, UserSerializerWithToken, UserProfileSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password
from rest_framework import status

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(
            username = data['username'],
            first_name = data['first_name'],
            last_name = data['last_name'],
            email = data['email'],
            password = make_password(data['password'])
        )

        user_profile = User_profile.objects.create(
            user=user,
            profile_photo=None,
            about=''
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.username = data['username']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    profile_photo = data['profile_photo']
    about = data['about']

    if profile_photo is not None:
        unique_profile_photo_name = f"profile_photos/{uuid.uuid4()}.jpg"

        if profile_photo.startswith('data:image'):
            format, imgstr = profile_photo.split(';base64,')
            profile_photo_decoded = base64.b64decode(imgstr)
        else:
            profile_photo_decoded = base64.b64decode(profile_photo)

        profile_photo_path = default_storage.save(unique_profile_photo_name, ContentFile(profile_photo_decoded))

        user_profile = getattr(user, 'user_profile', None)

        if user_profile:
            user_profile.profile_photo = profile_photo_path
            user_profile.about = about
            user_profile.save()
    else:
        user_profile = getattr(user, 'user_profile', None)

        if user_profile:
            user_profile.profile_photo = ''
            user_profile.about = about
            user_profile.save()

            if user_profile.profile_photo:
                default_storage.delete(user_profile.profile_photo)

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getUser(request, username):
    user = get_object_or_404(User, username=username)

    serializer_context = {'request': request}

    if request.user.is_authenticated:
        serializer_context['include_extra_details'] = True

    serializer = UserProfileSerializer(user, many=False, context=serializer_context)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, profile_id):
    profile_to_follow = get_object_or_404(User, id=profile_id)

    if request.user == profile_to_follow:
        return Response({"error": "You cannot follow yourself"}, status=400)

    follower, created = Follower.objects.get_or_create(
        follower=request.user,
        followed_user=profile_to_follow
    )

    if not created:
        return Response({"error": "You're already following this user"}, status=400)

    return Response({"message": f"You're now following {profile_to_follow.username}"}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, profile_id):
    profile_to_unfollow = get_object_or_404(User, id=profile_id)

    Follower.objects.filter(
        follower=request.user,
        followed_user=profile_to_unfollow
    ).delete()

    return Response({"message": f"You've unfollowed {profile_to_unfollow.username}"}, status=200)