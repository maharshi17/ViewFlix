import axios from 'axios'
import { 
    VIDEO_LIST_REQUEST, 
    VIDEO_LIST_SUCCESS, 
    VIDEO_LIST_FAIL,

    VIDEO_DETAILS_REQUEST, 
    VIDEO_DETAILS_SUCCESS, 
    VIDEO_DETAILS_FAIL,

    VIDEO_SEARCH_REQUEST, 
    VIDEO_SEARCH_SUCCESS, 
    VIDEO_SEARCH_FAIL,

    VIDEO_UPLOAD_REQUEST,
    VIDEO_UPLOAD_SUCCESS,
    VIDEO_UPLOAD_FAIL,

    COMMENT_POST_REQUEST,
    COMMENT_POST_SUCCESS,
    COMMENT_POST_FAIL,

    COMMENT_LIST_REQUEST,
    COMMENT_LIST_SUCCESS,
    COMMENT_LIST_FAIL,
} from '../constants/videoConstants'

export const listVideos = () => async(dispatch) => {
    try {
        dispatch({ type: VIDEO_LIST_REQUEST })

        const { data } = await axios.get('/api/videos/')

        dispatch({
            type: VIDEO_LIST_SUCCESS,
            payload: data
        })
    }
    catch(error) {
        dispatch({
            type: VIDEO_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message, 
        })
    }
}

export const listVideoDetails = (id) => async(dispatch, getState) => {
    try {
        dispatch({ type: VIDEO_DETAILS_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: userInfo ? `Bearer ${userInfo.token}` : '',
            },
        };

        const { data } = await axios.get(`/api/videos/${id}`, config)

        dispatch({
            type: VIDEO_DETAILS_SUCCESS,
            payload: data
        })
        
    }
    catch(error) {
        dispatch({
            type: VIDEO_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message, 
        })
    }
}


export const searchVideos = (q) => async(dispatch) => {
    try {
        dispatch({ type: VIDEO_SEARCH_REQUEST })

        const { data } = await axios.get(`/api/videos/search/${q}`)

        dispatch({
            type: VIDEO_SEARCH_SUCCESS,
            payload: data
        })
        
    }
    catch(error) {
        dispatch({
            type: VIDEO_SEARCH_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message, 
        })
    }
}

export const uploadVideo = (title, description, videoFile, thumbnailFile) => async (dispatch, getState) => {
    try {
        dispatch({ type: VIDEO_UPLOAD_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('videoFile', videoFile);
        formData.append('thumbnailFile', thumbnailFile);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post('/api/videos/upload/', formData, config);

        dispatch({
            type: VIDEO_UPLOAD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: VIDEO_UPLOAD_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};

export const postComment = (video_id, comment_text) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMMENT_POST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const formData = new FormData();
        formData.append('comment_text', comment_text);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(`/api/videos/${video_id}/comment/`, formData, config);

        dispatch({
            type: COMMENT_POST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMMENT_POST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        });
    }
};

export const listComments = (id) => async(dispatch) => {
    try {
        dispatch({ type: COMMENT_LIST_REQUEST })

        const { data } = await axios.get(`/api/videos/${id}/get_comments`)

        dispatch({
            type: COMMENT_LIST_SUCCESS,
            payload: data
        })
    }
    catch(error) {
        dispatch({
            type: COMMENT_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message, 
        })
    }
}