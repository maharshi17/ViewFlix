import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../logo/svg/glyph.svg'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { register } from '../actions/userActions'

function SignupPage() {

    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ message, setMessage ] = useState('')

    const dispatch = useDispatch()

    const navigate = useNavigate()
    const location = useLocation()

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister

    useEffect(() => {
        if(userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            setMessage('Passwords do not match')
        }
        else {
            dispatch(register(firstName, lastName, username, email, password))
        }
    }

    return (
        <div className="content text-center">
            <div className="form-signup">
            {loading && <Loader/>}
                <form onSubmit={submitHandler}>
                    <img className="mb-4" src={Logo} alt="" width="72" height="72"/>
                    <h1 className="h3 mb-3 fw-bold">Sign up to ViewFlix</h1>
                    {error && <Message variant='danger'>{error}</Message>}
                    {message && <Message variant='danger'>{message}</Message>}
                    <div className="form-floating">
                        <input type="text" className="form-control" id="firstname" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                        <label for="floatingInput">First name</label>
                    </div>
                    <div className="form-floating">
                        <input type="text" className="form-control" id="lastname" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
                        <label for="floatingInput">Last name</label>
                    </div>
                    <div className="form-floating">
                        <input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        <label for="floatingInput">Username</label>
                    </div>
                    <div className="form-floating">
                        <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        <label for="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <label for="floatingPassword">Password</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="confirm_password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                        <label for="floatingPassword">Confirm Password</label>
                    </div>
                    <button className="w-100 btn btn-primary my-3" id="signup_button" type="submit">Sign up</button>
                    <div className="my-3">
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignupPage