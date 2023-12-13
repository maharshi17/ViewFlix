import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../logo/svg/glyph.svg'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { login } from '../actions/userActions'

function LoginPage() {

    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')

    const dispatch = useDispatch()

    const navigate = useNavigate()
    const location = useLocation()

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    useEffect(() => {
        if(userInfo) {
            navigate(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(username, password))
    }

    return (
        <div className="content text-center">
            <div className="form-login">
            {loading && <Loader/>}
                <form onSubmit={submitHandler}>
                    <img className="mb-4" src={Logo} alt="" width="72" height="72"/>
                    <h1 className="h3 mb-3 fw-bold">Log in to ViewFlix</h1>
                    {error && <Message variant='danger'>{error}</Message>}
                    <div className="form-floating">
                        <input type="text" className="form-control" id="username" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        <label for="floatingInput">Username</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <label for="floatingPassword">Password</label>
                    </div>
                    <button className="w-100 btn btn-primary my-3" id="login_button" type="submit">Log in</button>
                    <div className="my-3">
                        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage