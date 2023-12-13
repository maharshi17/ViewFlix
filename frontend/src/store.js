import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { 
    videoListReducer, 
    videoDetailsReducer,
    videoSearchReducer,
    videoUploadReducer,
    commentPostReducer,
    commentListReducer,
} from './reducers/videoReducers'
import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    userProfileReducer,
    userUpdateProfileReducer,
} from './reducers/userReducers'

const reducer = combineReducers({
    videoList: videoListReducer,
    videoDetails: videoDetailsReducer,
    videoSearch: videoSearchReducer,
    videoUpload: videoUploadReducer,
    commentPost: commentPostReducer,
    commentList: commentListReducer,

    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userProfile: userProfileReducer,
    userUpdateProfile: userUpdateProfileReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
    userLogin: {userInfo: userInfoFromStorage}
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store