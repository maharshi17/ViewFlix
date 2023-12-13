import React, { useState, useEffect } from 'react'
import axios from 'axios';
// import videos from '../videos'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Row, Col } from 'react-bootstrap'
import { listVideoDetails, postComment, listComments } from '../actions/videoActions'

function VideoPage() {

    const defaultPhotoUrl = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg';

    const { id } = useParams()
    // const video = videos.find((v) => v._id == id)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const videoDetails = useSelector(state => state.videoDetails)
    const { loading, error, video } = videoDetails

    const commentList = useSelector(state => state.commentList)
    const { loading_comments, error_comments, comments } = commentList

    const [ isFollowing, setIsFollowing ] = useState(false);
    const [ profilePhoto, setProfilePhoto ] = useState('')
    const [comment, setComment] = useState('');

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [videoKey, setVideoKey] = useState(0);

    const uploadTime = video.upload_time;
    const timeAgoString = timeAgo(uploadTime);

    useEffect(() => {
        dispatch(listVideoDetails(id))
        dispatch(listComments(id))
    }, [dispatch, id])

    useEffect(() => {
        if (video && video.is_followed !== undefined) {
            setIsFollowing(video.is_followed);
        }
    }, [video])

    useEffect(() => {
        // Update the video key when the video object changes
        setVideoKey((prevKey) => prevKey + 1);
    }, [video]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (video && video._id) {
                axios.put(`/api/videos/${video._id}/update_views/`, null)
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [video, userInfo]);

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

    const likeVideo = async (e) => {
        if(!userInfo) {
            navigate('/login')
        }
        else {
            const dataLiked = e.currentTarget.getAttribute("data-liked");
            const likeCountElement = document.getElementById("likeCount");
            const likeIconElement = document.getElementById("likeIcon");
            const dataDisliked = document.getElementById("dislikeButton").getAttribute("data-disliked");
        
            if (dataDisliked === "true") {
                // If the video is already disliked, increase the like count and decrease the dislike count
                let likeCount = Number(likeCountElement.innerHTML);
                let dislikeCount = Number(document.getElementById("dislikeCount").innerHTML);
                likeCount += 1;
                dislikeCount -= 1;
        
                likeCountElement.innerHTML = likeCount;
                document.getElementById("dislikeCount").innerHTML = dislikeCount;
        
                likeIconElement.classList.remove("fa-regular");
                likeIconElement.classList.add("fas");
                document.getElementById("dislikeIcon").classList.remove("fas");
                document.getElementById("dislikeIcon").classList.add("fa-regular");
        
                e.currentTarget.setAttribute("data-liked", "true");
                e.currentTarget.setAttribute("title", "Liked");
                document.getElementById("dislikeButton").setAttribute("data-disliked", "false");
                document.getElementById("dislikeButton").setAttribute("title", "Dislike");
            } else {
                // If the video is not disliked, toggle the like state
                let likeCount = Number(likeCountElement.innerHTML);
                if (dataLiked === "true") {
                    likeCount -= 1;
                    likeIconElement.classList.remove("fas");
                    likeIconElement.classList.add("fa-regular");
                    e.currentTarget.setAttribute("data-liked", "false");
                    e.currentTarget.setAttribute("title", "Like");
                } else {
                    likeCount += 1;
                    likeIconElement.classList.remove("fa-regular");
                    likeIconElement.classList.add("fas");
                    e.currentTarget.setAttribute("data-liked", "true");
                    e.currentTarget.setAttribute("title", "Liked");
                }
                likeCountElement.innerHTML = likeCount;
            }

            await axios.post(`/api/videos/${video._id}/like/`, null, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                },
            });
        }
    };
    
    const dislikeVideo = async (e) => {
        if(!userInfo) {
            navigate('/login')
        }
        else {
            const dataDisliked = e.currentTarget.getAttribute("data-disliked");
            const dislikeCountElement = document.getElementById("dislikeCount");
            const dislikeIconElement = document.getElementById("dislikeIcon");
            const dataLiked = document.getElementById("likeButton").getAttribute("data-liked");
        
            if (dataLiked === 'true') {
                // If the video is already liked, increase the dislike count and decrease the like count
                let dislikeCount = Number(dislikeCountElement.innerHTML);
                let likeCount = Number(document.getElementById("likeCount").innerHTML);
                dislikeCount += 1;
                likeCount -= 1;
        
                dislikeCountElement.innerHTML = dislikeCount;
                document.getElementById("likeCount").innerHTML = likeCount;
        
                dislikeIconElement.classList.remove("fa-regular");
                dislikeIconElement.classList.add("fas");
                document.getElementById("likeIcon").classList.remove("fas");
                document.getElementById("likeIcon").classList.add("fa-regular");
        
                e.currentTarget.setAttribute("data-disliked", "true");
                e.currentTarget.setAttribute("title", "Disliked");
                document.getElementById("likeButton").setAttribute("data-liked", "false");
                document.getElementById("likeButton").setAttribute("title", "Like");
            } else {
                // If the video is not liked, toggle the dislike state
                let dislikeCount = Number(dislikeCountElement.innerHTML);
                if (dataDisliked === 'true') {
                    dislikeCount -= 1;
                    dislikeIconElement.classList.remove("fas");
                    dislikeIconElement.classList.add("fa-regular");
                    e.currentTarget.setAttribute("data-disliked", "false");
                    e.currentTarget.setAttribute("title", "Dislike");
                } else {
                    dislikeCount += 1;
                    dislikeIconElement.classList.remove("fa-regular");
                    dislikeIconElement.classList.add("fas");
                    e.currentTarget.setAttribute("data-disliked", "true");
                    e.currentTarget.setAttribute("title", "Disliked");
                }
                dislikeCountElement.innerHTML = dislikeCount;
            }

            await axios.post(`/api/videos/${video._id}/dislike/`, null, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                },
            });
        }
    };
    
    const followHandler = async () => {
        if(!userInfo) {
            navigate('/login')
        }
        else {
            if (isFollowing) {
                await axios.post(`/api/users/${video.user_id}/unfollow/`, null, {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`,
                    },
                });
            } else {
                await axios.post(`/api/users/${video.user_id}/follow/`, null, {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`,
                    },
                });
            }
            setIsFollowing(prevState => !prevState);
        }
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setComment(inputValue);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const comment_text = document.getElementById('comment_input').value;

        if (comment_text) {
            dispatch(postComment(id, comment_text));
            dispatch(listComments(id))

            setComment('');
        }
    }

    return (
        
        loading ? <Loader/>
        : error ? <Message variant="danger">{error}</Message>
        : 
        <div className="content">
            <div className="video-container">
                <Container className="video-frame">
                    <video key={videoKey} width="100%" controls nodownload="true" controlsList="nodownload" autoPlay>
                        <source type="video/mp4" src={`${video.video_file}`} />
                    </video>
                </Container>
            </div>
            <Container>
                <Row>
                    <Col md={8}>
                        <div className="video-details">
                            <div className="title-row">
                                <p className="title fs-4 fw-bold">{video.title}</p>
                            </div>
                            <div className="profile-row justify-content-between">
                                <div className="d-flex">
                                    <Link to={`/${video.username}`} className="user-info">
                                        <img
                                            className="profile-photo"
                                            src={profilePhoto}
                                            alt="User Profile"
                                        />
                                        <strong className="username">{video.username}</strong>
                                    </Link>
                                    {
                                        video.username !== (userInfo?.username || null) && (
                                            <button
                                                className={`btn ${isFollowing ? 'btn-outline-primary' : 'btn-primary'}`}
                                                id="followBtn"
                                                onClick={followHandler}
                                            >
                                                {isFollowing ? (
                                                    <>
                                                        <strong>Following <i className="fa-solid fa-check"></i></strong>
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>Follow <i className="fa fa-plus"></i></strong>
                                                    </>
                                                )}
                                            </button>
                                        )
                                    }
                                </div>
                                <div className="btn-group" role="group" aria-label="Like and Dislike Buttons">
                                    <button type="button" className="btn like-btn" id="likeButton" title="Like" onClick={likeVideo} data-liked={video.is_liked ? "true" : "false"}>
                                        <i className={video.is_liked ? "fas fa-thumbs-up" : "far fa-thumbs-up"} id="likeIcon"></i> <span id="likeCount">{video.like_count}</span>
                                    </button>
                                    <button type="button" className="btn dislike-btn" id="dislikeButton" title="dislike" onClick={dislikeVideo} data-disliked={video.is_disliked ? "true" : "false"}>
                                        <i className={video.is_disliked ? "fas fa-thumbs-down" : "far fa-thumbs-down"} id="dislikeIcon"></i> <span id="dislikeCount">{video.dislike_count}</span>
                                    </button>
                                </div>
                            </div>
                            <div className="views-row d-flex">
                                <p className="upload-time fw-bold">{timeAgoString}</p>&nbsp;&middot;&nbsp;
                                <p className="views fw-bold">{video.view_count} {video.view_count == 1 ? 'view' : 'views'}</p>
                            </div>
                            <div className="mt-3">
                                <p>{video.description}</p>
                            </div>
                            <div className="my-3">
                                <h4><strong>{video.total_comments == 1 ? video.total_comments + ' Comment' : video.total_comments + ' Comments'}</strong></h4>
                                {userInfo && userInfo.username ? (
                                    <form onSubmit={submitHandler}>
                                        <div className="comment-post-section d-flex align-items-start mb-4">
                                            <div className="user-info">
                                                <img className="profile-photo" src={userInfo.profile_photo} alt="User Profile"/>
                                            </div>
                                            <div className="comment-input">
                                                <input type="text" id="comment_input" className="form-control py-2" placeholder="Write a comment..." value={comment} onChange={handleInputChange} autoComplete='off'
                                                />
                                            </div>
                                            <button className="btn btn-primary post-button py-2" type="submit" disabled={!comment.length > 0}>Post</button>
                                        </div>
                                    </form>
                                ) : (
                                    <p><Link to={'/login'}>Log in</Link> to write a comment.</p>
                                )}

                                {
                                    loading_comments ? (
                                        <div className="my-4">
                                            <Loader/>
                                        </div>
                                    ) : error_comments ? (
                                        <Message variant="danger">{error_comments}</Message>
                                    )
                                    : comments && comments.length > 0 ? (
                                            comments.map(comment => (
                                                <div>
                                                    <div className="d-flex align-items-start">
                                                        <Link to={`/${comment.username}`} className="user-info">
                                                            <img
                                                                className="profile-photo"
                                                                src={comment.profile_photo}
                                                                alt="User Profile"
                                                            />
                                                            <strong className="username">{comment.username}</strong>
                                                            &nbsp;&middot;&nbsp;
                                                            <p className="upload-time">{timeAgo(comment.post_time)}</p>
                                                        </Link>
                                                    </div>
                                                    <div className="comment-text">
                                                        <p>{comment.comment_text}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )
                                         : (
                                            <div className="my-5">
                                                <h5 align="center">No Comments</h5>
                                            </div>
                                        )              
                                }
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default VideoPage