import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { uploadVideo } from '../actions/videoActions'

function UploadVideoPage() {

    const dispatch = useDispatch()

    const navigate = useNavigate()
    const location = useLocation()

    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [isVideoUploaded, setIsVideoUploaded] = useState(false);

    const videoRef = useRef(null);

    const videoUpload = useSelector(state => state.videoUpload)
    const { error, loading, video } = videoUpload

    const handleRemoveVideo = () => {
        setVideoFile(null);
        setThumbnailFile(null);
    };

    const handleFileInputChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setVideoFile(selectedFile);
            generateThumbnail(selectedFile);
        }
    };

    const handleFileDrop = (e, setFile) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleFileClick = (inputElement) => {
        inputElement.click();
    };

    const generateThumbnail = (file) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadeddata = () => {
            video.currentTime = video.duration / 2; // Set to middle of the video
            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 854;
                canvas.height = 480;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    setThumbnailFile(blob);
                }, 'image/jpeg', 0.8);
            };
        };
        video.src = URL.createObjectURL(file);
    };

    const submitHandler = (e) => {
        e.preventDefault();
    
        const title = document.getElementById('title').value;
        const description = document.getElementById('desc').value;
    
        if (title && videoFile && thumbnailFile) {
            const reader = new FileReader();

            reader.onload = () => {
                const thumbnailBase64 = reader.result;

                dispatch(uploadVideo(title, description, videoFile, thumbnailBase64));
                setIsVideoUploaded(true);
            };
            reader.readAsDataURL(thumbnailFile);
        } else {
            console.log('Please fill in all the details.');
        }
    };
    
    useEffect(() => {
        if (video && !loading && !error && isVideoUploaded) {
            navigate(`/video/${video._id}`);
        }
    }, [video, loading, error, navigate, isVideoUploaded]);

    const DisplayVideo = ({ videoFile, onRemove }) => (
        <div className="file-block">
            <h5>Selected Video:</h5>
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                <button onClick={onRemove} className="btn btn-link remove-video-btn" title="Remove video">
                    <span aria-hidden="true">&times;</span>
                </button>
    
                <video
                    controls
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );

    return (
        <Container className="video-upload-container">
            <h2>Upload Video</h2><hr/>
            {error && <Message variant='danger'>{error}</Message>}
            <form onSubmit={submitHandler} encType="multipart/form-data">
                <Row>
                    <Col xs={12} md={6}>
                        <div className="form-group mb-4">
                            <label htmlFor="video">Choose Video:</label>
                            <div
                                className="file-upload"
                                onDrop={(e) => handleFileDrop(e, setVideoFile)}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => handleFileClick(document.getElementById('input-video'))}
                            >
                                {!videoFile && (
                                    <div className="preview-container">
                                        <i className="fas fa-video video-icon"></i>
                                        <p>Click or Drag & Drop a video here.</p>
                                    </div>
                                )}
                                {videoFile && (
                                    <DisplayVideo videoFile={videoFile} onRemove={handleRemoveVideo} />
                                )}
                            </div>
                        </div>

                        <input
                            type="file"
                            id="input-video"
                            className="file-input"
                            onChange={(e) => handleFileInputChange(e, setVideoFile)}
                            accept="video/*"
                            style={{ display: 'none' }}
                            required
                        />

                        <div className="file-block">
                            {thumbnailFile && (
                                <>
                                    <h5 className="text-center">Thumbnail:</h5>
                                    <img
                                        src={URL.createObjectURL(thumbnailFile)}
                                        alt="Thumbnail"
                                        id="thumbnail"
                                        style={{ width: '100%' }}
                                    />
                                </>
                            )}
                        </div>
                    </Col>
                    <Col xs={12} md={6}>
                        <div className="form-group mb-4">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                placeholder="Enter title"
                                required
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="desc">Description:</label>
                            <textarea
                                className="form-control"
                                id="desc"
                                name="desc"
                                rows="8"
                                placeholder="Enter description"
                            ></textarea>
                        </div>

                        <div>
                            <button type="submit" className="btn btn-primary" name="upload">
                                Upload Video
                            </button>
                        </div>
                    </Col>
                </Row>
            </form>
        </Container>
    );
}

export default UploadVideoPage