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

export const videoListReducer = (state = {videos: []}, action) => {
    switch(action.type) {
        case VIDEO_LIST_REQUEST:
            return { loading: true, videos: [] }
        case VIDEO_LIST_SUCCESS:
            return { loading: false, videos: action.payload }
        case VIDEO_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
} 

export const videoDetailsReducer = (state = {video: {}}, action) => {
    switch(action.type) {
        case VIDEO_DETAILS_REQUEST:
            return { loading: true, ...state }
        case VIDEO_DETAILS_SUCCESS:
            return { loading: false, video: action.payload }
        case VIDEO_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
} 

export const videoSearchReducer = (state = {videos: []}, action) => {
    switch(action.type) {
        case VIDEO_SEARCH_REQUEST:
            return { loading: true, videos: [] }
        case VIDEO_SEARCH_SUCCESS:
            return { loading: false, videos: action.payload }
        case VIDEO_SEARCH_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
} 

export const videoUploadReducer = (state = {video: {}}, action) => {
    switch(action.type) {
        case VIDEO_UPLOAD_REQUEST:
            return { loading: true, ...state }
        case VIDEO_UPLOAD_SUCCESS:
            return { loading: false, video: action.payload }
        case VIDEO_UPLOAD_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const commentPostReducer = (state = {comment: {}}, action) => {
    switch(action.type) {
        case COMMENT_POST_REQUEST:
            return { loading: true, ...state }
        case COMMENT_POST_SUCCESS:
            return { loading: false, comment: action.payload }
        case COMMENT_POST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const commentListReducer = (state = {comments: []}, action) => {
    switch(action.type) {
        case COMMENT_LIST_REQUEST:
            return { loading_comments: true, comments: [] }
        case COMMENT_LIST_SUCCESS:
            return { loading_comments: false, comments: action.payload }
        case COMMENT_LIST_FAIL:
            return { loading_comments: false, error_comments: action.payload }
        default:
            return state
    }
} 