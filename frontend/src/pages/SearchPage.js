import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { searchVideos } from '../actions/videoActions';

function SearchPage() {
    const defaultPhotoUrl = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg';

    const { search } = useLocation();
    const queryParam = new URLSearchParams(search).get('q');

    const dispatch = useDispatch();
    const videoSearch = useSelector(state => state.videoSearch);
    const { loading, error, videos } = videoSearch;

    useEffect(() => {
        dispatch(searchVideos(queryParam));
    }, [dispatch, queryParam]);

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
        <div className="container search-container">
            <h3>Showing result for "{queryParam}"</h3>
            <div className="row">
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : videos && videos.length > 0 ? (
                    videos.map(video => (
                        <Card key={video._id} className="my-3 rounded video-card video-card-horizontal">
                            <Link to={`/video/${video._id}`}>
                                <div className="row">
                                    <div className="col-md-4" style={{ paddingRight: 0, paddingLeft: 0 }}>
                                        <div className="frame">
                                            <img src={`${video.thumbnail_file}`} width="100%" alt="Video Thumbnail" />
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="video-details">
                                            <div className="title-row">
                                                <p className="title search-video-title" title={video.title}>
                                                    {video.title}
                                                </p>
                                            </div>
                                            <div className="profile-row">
                                                <Link to={`/${video.username}`} className="user-info">
                                                    <img className="profile-photo" src={video.profile_photo ? video.profile_photo : defaultPhotoUrl
                                                    } alt="User Profile" />
                                                    <p className="username">{video.username}</p>
                                                </Link>
                                            </div>
                                            <div className="views-row">
                                                <div className="d-flex">
                                                    <p className="views">{formatViews(video.view_count)} views</p>&nbsp;&middot;&nbsp;
                                                    <p className="upload-time">{timeAgo(video.upload_time)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    ))
                ) : (
                    <Message variant="info">No videos found.</Message>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
