import React, { useState, useContext } from 'react'
import { UserContext } from '../../UserContext';
import { Navigate } from 'react-router-dom';
// The Login component is a functional component that provides a login form for users to enter their email and password. It uses React hooks, such as useState and useContext, to manage state and context within the component.
const Login = () => {
    // The useContext hook is used to access the user and setUser values from a UserContext, which presumably holds information about the currently logged-in user.
    const { user, setUser } = useContext(UserContext);
    // The component has several state variables initialized using the useState hook, including name, email, password, nameError, and emailError, and passwordError. These state variables hold the values entered by the user in the form fields and the error messages for each field, which are initially set to empty strings.
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    // The form fields for email and password are controlled components, where their values are linked to the corresponding state variables email and password using the value prop and the onChange event handler. When the values of these form fields change, the onChange event handler updates the state variables accordingly using the setEmail and setPassword functions from the useState hook.
    const submitHandler = async e => {
        e.preventDefault();
        setEmailError('');
        setNameError('');
        setPasswordError('');
        console.log(name, email, password)
        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ name, email, password }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            console.log(data)
            // If there are any errors returned from the server (e.g., invalid email, password, etc.), they are displayed in the respective error message div elements using conditional rendering based on the data.errors object received from the server.
            if (data.errors) {
                setEmailError(data.errors.email);
                setNameError(data.errors.name);
                setPasswordError(data.errors.password);

            }
            // The setUser function then updates the user context with the logged-in user's information, making it available to other components in the application that may need to access or display user-related data.
            if (data.user) {
                setUser(data.user)
            }
        } catch (error) {
            console.log(error)
        }
    }
    // If the user is already logged in (i.e., user value from UserContext is truthy), the component redirects to the home page using the Navigate component, presumably from a routing library like React Router.
    if (user) {
        return <Navigate to="/" />
    }
    return (

        <div className="row">
            <h2>Login</h2>
            <form className="col s12" onSubmit={submitHandler}>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="email" type="email" className="validate"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className="email error red-text">{emailError}</div>
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="password" type="password" className="validate"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="password error red-text">{passwordError}</div>
                        <label htmlFor="password">Password</label>
                    </div>
                </div>

                <button className="btn">Login</button>
            </form>
        </div>

    )
}

export default Login
