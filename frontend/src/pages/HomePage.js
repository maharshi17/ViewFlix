import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listVideos } from '../actions/videoActions'

function HomePage() {

    const dispatch = useDispatch()
    const videoList = useSelector(state => state.videoList)
    const { error, loading, videos } = videoList

    useEffect(() => {
        dispatch(listVideos())
    }, [dispatch])

    return (
        <Container className="py-3">
            <div className="content">
                <h1>Latest videos</h1>
                {
                    loading ? <Loader/>
                        : error ? <Message variant="danger">{error}</Message>
                        : 
                        <Row>
                            {videos.map(video => (
                                <Col key={video._id} sm={12} md={6} lg={4} xl={4}>
                                    <VideoCard video={video}/>
                                </Col>
                            ))}
                        </Row>
                }
            </div>
        </Container>
    )
}

export default HomePage