import React, { useState, useContext } from 'react'
import { UserContext } from '../../UserContext';
import { Navigate } from 'react-router-dom';
import "./login.scss";
const Login = () => {
    const { user, setUser } = useContext(UserContext);

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
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
            if (data.errors) {
                setEmailError(data.errors.email);
                setNameError(data.errors.name);
                setPasswordError(data.errors.password);

            }
            if (data.user) {
                setUser(data.user)
            }
        } catch (error) {
            console.log(error)
        }
    }
    if (user) {
        return <Navigate to="/" />
    }
    return (
        <section className="h-100 gradient-form">
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-xl-10">
        <div className="card rounded-3 text-black">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="card-body p-md-5 mx-md-4">

                <div classNameName="text-center">
                  <img className="logoImage" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                     alt="logo"/>
                  <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
                </div>

                <form>
                  <p>Please login to your account</p>

                  <div className="form-outline mb-4">
                    <input type="email" id="form2Example11" className="form-control"
                      placeholder="Phone number or email address" />
                    <label className="form-label" for="form2Example11">Username</label>
                  </div>

                  <div className="form-outline mb-4">
                    <input type="password" id="form2Example22" className="form-control" />
                    <label className="form-label" for="form2Example22">Password</label>
                  </div>

                  <div className="text-center pt-1 mb-5 pb-1">
                    <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="button">Log
                      in</button>
                    <a className="text-muted" href="#!">Forgot password?</a>
                  </div>

                  <div className="d-flex align-items-center justify-content-center pb-4">
                    <p className="mb-0 me-2">Don't have an account?</p>
                    <button type="button" className="btn btn-outline-danger">Create new</button>
                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    )
    return (

        <div classNameName="row">
            <h2>Login</h2>
            <form classNameName="col s12" onSubmit={submitHandler}>
                <div classNameName="row">
                    <div classNameName="input-field col s12">
                        <input id="email" type="email" classNameName="validate"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div classNameName="email error red-text">{emailError}</div>
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div classNameName="row">
                    <div classNameName="input-field col s12">
                        <input id="password" type="password" classNameName="validate"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div classNameName="password error red-text">{passwordError}</div>
                        <label htmlFor="password">Password</label>
                    </div>
                </div>

                <button classNameName="btn">Login</button>
            </form>
        </div>

    )
}

export default Login
