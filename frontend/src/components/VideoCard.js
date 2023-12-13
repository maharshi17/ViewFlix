import React, {useEffect, useState} from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function VideoCard({video}) {

    const defaultPhotoUrl = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg';

    const viewCount = video.view_count;
    const formattedViewCount  = formatViews(viewCount);

    const uploadTime = video.upload_time;
    const timeAgoString = timeAgo(uploadTime);

    const [ profilePhoto, setProfilePhoto ] = useState('')

    useEffect(() => {
        if (video.profile_photo == null) {
            setProfilePhoto(defaultPhotoUrl)
        }
        else {
            setProfilePhoto(video.profile_photo)
        }
    })

    function formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(0) + 'M';
        }
        else if (views >= 1000) {
            if (views < 10000){
                return (views / 1000).toFixed(1) + 'K';
            }
            else {
                return (views / 1000).toFixed(0) + 'K';
            }
        }
        else {
            return views.toString();
        }
    }

    function timeAgo(timestamp) {
        const currentTime = new Date();
        const uploadTime = new Date(timestamp);
        const timeDifference = currentTime - uploadTime;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30.44);
        const years = Math.floor(months / 12);
      
        if (years > 0) {
            return years + (years === 1 ? ' year ago' : ' years ago');
        } else if (months > 0) {
            return months + (months === 1 ? ' month ago' : ' months ago');
        } else if (days > 0) {
            return days + (days === 1 ? ' day ago' : ' days ago');
        } else if (hours > 0) {
            return hours + (hours === 1 ? ' hour ago' : ' hours ago');
        } else if (minutes > 0) {
            return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
        } else {
            return seconds + (seconds === 1 ? ' second ago' : ' seconds ago');
        }
    }

    return (
        <Card className="my-3 rounded video-card">
            <Link to={`/video/${video._id}`}>
                <div className="frame">
                    {/* <video width="100%">
                        <source type="video/mp4" src={`${video.video_file}`}/>
                    </video> */}
                    <img src={`${video.thumbnail_file}`} width="100%"/>
                </div>
            
                <div className="video-details">
                    <div className="title-row">
                        <p className="title" title={video.title}>{video.title}</p>
                    </div>
                    <div className="profile-row">
                        <Link to={`/${video.username}`} className="user-info">
                            <img className="profile-photo" src={profilePhoto} alt="User Profile" />
                            <p className="username">{video.username}</p>
                        </Link>
                        <p className="upload-time">{timeAgoString}</p>
                    </div>
                    <div className="views-row">
                        <p className="views">{formattedViewCount} views</p>
                    </div>
                </div>
            </Link>
        </Card>
    )
}

export default VideoCard