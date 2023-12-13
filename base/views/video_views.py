import io, base64, uuid
from PIL import Image

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser 
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from base.models import Video, Like, Comment
from base.serializers import VideoSerializer, CommentSerializer


@api_view(['GET'])
def getVideos(request):
    videos = Video.objects.all().order_by('-upload_time')
    serializer = VideoSerializer(videos, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def getVideo(request, pk):
    video = get_object_or_404(Video, _id=pk)
    
    serializer_context = {'request': request}

    if request.user.is_authenticated:
        serializer_context['include_extra_details'] = True

    serializer = VideoSerializer(video, many=False, context=serializer_context)
    return Response(serializer.data)


@api_view(['GET'])
def searchVideo(request, q):
    video = Video.objects.filter(title__icontains=q)
    serializer = VideoSerializer(video, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def uploadVideo(request):
    user = request.user
    data = request.data

    title = data['title']
    description = data['description']
    video_file = data['videoFile']
    thumbnail_data = data['thumbnailFile']

    unique_video_filename = f"videos/{uuid.uuid4()}.mp4"
    unique_thumbnail_filename = f"thumbnails/{uuid.uuid4()}.jpg"

    video_path = default_storage.save(unique_video_filename, ContentFile(video_file.read()))

    try:
        if thumbnail_data.startswith('data:image'):
            format, imgstr = thumbnail_data.split(';base64,')
            thumbnail_decoded = base64.b64decode(imgstr)
        else:
            thumbnail_decoded = base64.b64decode(thumbnail_data)

        thumbnail_image = Image.open(io.BytesIO(thumbnail_decoded))
        thumbnail_image.verify()

        thumbnail_path = default_storage.save(unique_thumbnail_filename, ContentFile(thumbnail_decoded))

        video = Video.objects.create(
            user=user,
            title=title,
            description=description,
            video_file=video_path,
            thumbnail_file=thumbnail_path
        )

        serializer = VideoSerializer(video, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def updateViews(request, pk):
    try:
        video = Video.objects.get(_id=pk)
        video.view_count += 1
        video.save()
    
        serializer = VideoSerializer(video, many=False)
        return Response(serializer.data)
    except Video.DoesNotExist:
        return Response({'detail': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likeVideo(request, pk):
    try:
        user = request.user
        video = Video.objects.get(_id=pk)

        existing_like = Like.objects.filter(user=user, video=video).first()

        if existing_like:
            if existing_like.like:
                existing_like.delete()
                video.like_count -= 1 if video.like_count > 0 else 0
            else: 
                existing_like.like = True
                existing_like.save()
                video.like_count += 1
                video.dislike_count -= 1 if video.dislike_count > 0 else 0
        else:
            Like.objects.create(user=user, video=video, like=True)
            video.like_count += 1

        video.save()
        serializer = VideoSerializer(video, many=False)
        return Response(serializer.data)
    except Video.DoesNotExist:
        return Response({'detail': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dislikeVideo(request, pk):
    try:
        user = request.user
        video = Video.objects.get(_id=pk)

        existing_dislike = Like.objects.filter(user=user, video=video).first()

        if existing_dislike:
            if not existing_dislike.like:
                existing_dislike.delete()
                video.dislike_count -= 1 if video.dislike_count > 0 else 0
            else:
                existing_dislike.like = False
                existing_dislike.save()
                video.dislike_count += 1
                video.like_count -= 1 if video.like_count > 0 else 0
        else:
            Like.objects.create(user=user, video=video, like=False)
            video.dislike_count += 1

        video.save()
        serializer = VideoSerializer(video, many=False)
        return Response(serializer.data)
    except Video.DoesNotExist:
        return Response({'detail': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def postComment(request, pk):
    user = request.user
    data = request.data

    try:
        video = Video.objects.get(_id=pk)
    except video.DoesNotExist:
        return Response({'detail': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

    comment_text = data['comment_text']

    if not comment_text:
        return Response({'error': 'Comment text is required'}, status=status.HTTP_400_BAD_REQUEST)

    comment = Comment.objects.create(video=video, user=user, comment_text=comment_text)
    serializer = CommentSerializer(comment)

    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def getComments(request, pk):
    try:
        video = Video.objects.get(_id=pk)
    except Video.DoesNotExist:
        return Response({'detail': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

    comments = Comment.objects.filter(video=video).order_by('-post_time')
    serializer = CommentSerializer(comments, many=True)
    
    return Response(serializer.data)