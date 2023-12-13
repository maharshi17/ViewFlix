import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

function EditProfilePage() {

    const defaultPhotoUrl = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg';

    const [profilePhoto, setProfilePhoto] = useState('');
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ about, setAbout ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ message, setMessage ] = useState('')

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    useEffect(() => {
        if(!userInfo) {
            navigate('/login')
        }
        else {
            if(!user || !user.username || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
            }
            else {
                user.profile_photo == null ? setProfilePhoto(defaultPhotoUrl) : setProfilePhoto(user.profile_photo)
                setFirstName(user.first_name)
                setLastName(user.last_name)
                setUsername(user.username)
                setEmail(user.email)
                setAbout(user.about)
            }
        }
    }, [dispatch, navigate, userInfo, user, success])

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        const imageType = /image.*/;

        if (file && file.type.match(imageType)) {
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const maxSize = 250;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);
                    setProfilePhoto(canvas.toDataURL('image/jpeg'));
                };
            };

            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setProfilePhoto(defaultPhotoUrl);
    };

    const submitHandler = (e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            setMessage('Passwords do not match')
        }
        else {
            let finalProfilePhoto
            
            if (profilePhoto == defaultPhotoUrl) {
                finalProfilePhoto = null
            }
            else {
                finalProfilePhoto = profilePhoto
            }
            
            dispatch(updateUserProfile({
                'id': user._id,
                'profile_photo': finalProfilePhoto,
                'first_name': firstName,
                'last_name': lastName,
                'username': username,
                'email': email,
                'about': about,
                'password': password,
            }))

            setMessage('')
        }
    }

    return (
        <div className="content">
            <div className="container py-2 col-12 col-lg-4">
                <h1>Edit Profile</h1>
                {loading && <Loader/>}
                {error && <Message variant='danger'>{error}</Message>}
                {message && <Message variant='danger'>{message}</Message>}
                <form onSubmit={submitHandler}>
                    <div className="my-4" align="center">
                        <label for="profile-photo-input">
                            <img src={profilePhoto} className="profile-photo" height="150" width="150" alt="Profile photo" style={{ cursor: 'pointer' }}/>
                            <input type="file" id="profile-photo-input" style={{ display: 'none' }} accept="image/*" onChange={handlePhotoChange} />
                        </label>
                        <div className="my-2">
                            {profilePhoto !== defaultPhotoUrl && (
                                <button className="btn btn-danger" onClick={removePhoto}>Remove Photo</button>
                            )}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <label htmlFor="firstname" className="form-label">First name</label>
                            <input type="text" className="form-control" id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="lastname" className="form-label">Last name</label>
                            <input type="text" className="form-control" id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                    </div>
                    <div className="mb-2">
                        <label for="username">Username</label>
                        <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    </div>
                    <div className="mb-2">
                        <label for="email">Email address</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="mb-2">
                        <label for="about">About</label>
                        <textarea className="form-control" id="about" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                    </div>
                    <div className="mb-2">
                        <label for="password">Password</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="mb-2">
                        <label for="confirm_password">Confirm Password</label>
                        <input type="password" className="form-control" id="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>

                    <button type="submit" className="btn btn-primary mt-4 w-100">
                        Update
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditProfilePage