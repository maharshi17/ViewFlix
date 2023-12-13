from django.urls import path
from base.views import video_views as views

urlpatterns = [
    path('', views.getVideos, name='videos'),
    path('<int:pk>/', views.getVideo, name='video'),
    path('search/<str:q>/', views.searchVideo, name='search'),
    path('upload/', views.uploadVideo, name='video-upload'),
    path('<int:pk>/update_views/', views.updateViews, name='views-update'),
    path('<int:pk>/like/', views.likeVideo, name='video-like'),
    path('<int:pk>/dislike/', views.dislikeVideo, name='video-dislike'),
    path('<int:pk>/comment/', views.postComment, name='post-comment'),
    path('<int:pk>/get_comments', views.getComments, name='get-comments'),
]
