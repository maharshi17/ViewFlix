from django.urls import path
from base.views import user_views as views

urlpatterns = [
    path('', views.getUsers, name='users'),
    path('<str:username>', views.getUser, name='user'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'),
    path('profile/', views.getUserProfile, name='users-profile'),
    path('profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('<int:profile_id>/follow/', views.follow_user, name='follow-user'),
    path('<int:profile_id>/unfollow/', views.unfollow_user, name='unfollow-user'),
]
