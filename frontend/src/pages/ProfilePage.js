import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import VideoCard from '../components/VideoCard'
import { Row, Col } from 'react-bootstrap'
import { getUserProfile } from '../actions/userActions'

function ProfilePage() {

    const defaultPhotoUrl = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg';

    const { str } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [ isFollowing, setIsFollowing ] = useState(false);
    
    const userProfile = useSelector(state => state.userProfile)
    const { loading, error, user } = userProfile

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [activeTab, setActiveTab] = useState('videos');
    const [ profilePhoto, setProfilePhoto ] = useState('')
    
    useEffect(() => {
        dispatch(getUserProfile(str))
    }, [dispatch, str])

    useEffect(() => {
        if (user.profile_photo == null) {
            setProfilePhoto(defaultPhotoUrl)
        }
        else {
            setProfilePhoto(user.profile_photo)
        }
    })

    useEffect(() => {
        if (user && typeof user.is_followed === 'boolean') {
            setIsFollowing(user.is_followed);
        }
    }, [user]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const followHandler = async () => {
        if(!userInfo) {
            navigate('/login')
        }
        else {
            if (isFollowing) {
                await axios.post(`/api/users/${user._id}/unfollow/`, null, {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`,
                    },
                });
            } else {
                await axios.post(`/api/users/${user._id}/follow/`, null, {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`,
                    },
                });
            }
            setIsFollowing(prevState => !prevState);
        }
    };

    const formatDate = (dateString) => {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        loading ? <Loader/>
        : error ? <Message variant="danger">{error}</Message>
        : 
        <div className="container profile-container">
            <div className="row">
                <div className="col-md-3">
                    <div className="rounded-circle profile-pic-container my-2">
                        <img src={profilePhoto} className="img-fluid rounded-circle"  width="200" height="200" alt="Profile Picture"/>
                    </div>
                    <h2>{user.first_name} {user.last_name}</h2>
                    <p>{user.username}</p>
                    <p>{user.followers_count} {user.followers_count == 1 ? 'Follower' : 'Followers'}</p>
                    <p>{user.total_videos} {user.total_videos == 1 ? 'Video' : 'Videos'}</p>
                    {
                        user.username !== (userInfo?.username || null) ? (
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
                        ) : (
                            <Link to="/edit_profile">
                                <button className="btn btn-primary">Edit Profile</button>
                            </Link>
                        )
                    }
                </div>
                <div className="col-md-9">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${activeTab === 'videos' ? 'active' : ''}`}
                                to="#"
                                onClick={() => handleTabClick('videos')}
                            >
                                Videos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                                to="#"
                                onClick={() => handleTabClick('about')}
                            >
                                About
                            </Link>
                        </li>
                    </ul>
                    <div className="tab-content mt-3">
                        <div
                            className={`tab-pane fade ${activeTab === 'videos' ? 'show active' : ''}`}
                        >
                            <h3>Videos</h3>
                            <Row>
                                {user.videos ? (
                                    user.videos.map((video) => (
                                    <Col key={video._id} sm={12} md={6} lg={4} xl={4}>
                                        <VideoCard video={video} />
                                    </Col>
                                    ))
                                ) : (
                                    <p>No videos found</p>
                                )}
                            </Row>
                        </div>
                        <div
                            className={`tab-pane fade ${activeTab === 'about' ? 'show active' : ''}`}
                        >
                            <h3>About</h3>
                            <div className="about-content">
                                <p>{user.about}</p>
                                <p>Joined: {formatDate(user.date_joined)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
