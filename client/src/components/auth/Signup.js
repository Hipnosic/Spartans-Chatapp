import React, { useState, useContext } from 'react'
import { UserContext } from '../../UserContext';
import { Navigate } from 'react-router-dom';
import "./signup.scss";
const Signup = () => {
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
            const res = await fetch('http://localhost:5000/signup', {
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
            console.log("nått gick snett; ", error)
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
                <div className="row g-0 align-items-center justify-content-center">
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
    
                      <div className="text-center">
                        <img className="logoImage" src={require('../../assets/spartan.png')} alt="logo"/>
                        <h4 className="mt-1 mb-5 pb-1">Spartans Chat</h4>
                      </div>
    
                      <form onSubmit={submitHandler}>
                        <p>Please put in your information</p>
    
                        <div className="form-outline mb-4">
                            <input id="name" type="text" className="validate form-control"
                                placeholder="Enter your name!"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <div className="name error red-text">{nameError}</div>
                            <label htmlFor="name">Name</label>
                        </div>
    
                        <div className="form-outline mb-4">
                            <input id="email" type="email" className="validate form-control"
                                placeholder="Enter your email!"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <div className="email error red-text">{emailError}</div>
                            <label htmlFor="email">Email</label>
                        </div>

                        <div className="form-outline mb-4">
                            <input id="password" type="password" className="validate form-control"
                                placeholder="Enter your password!"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <div className="password error red-text">{passwordError}</div>
                            <label htmlFor="password">Password</label>
                        </div>
    
                        <div className="text-center pt-1 mb-5 pb-1">
                          <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3">Signup</button>
                        </div>
    
                        <div className="d-flex align-items-center justify-content-center pb-4">
                          <p className="mb-0 me-2">Already have an account?</p>
                          <button className="btn btn-outline-danger">
                          <a href="/login">Login</a>
                          </button>
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
    // return (

    //     <div className="row">
    //         <h2>Sign up</h2>
    //         <form className="col s12" onSubmit={submitHandler}>
    //             <div className="row">
    //                 <div className="input-field col s12">
    //                     <input id="name" type="text" className="validate"
    //                         value={name}
    //                         onChange={e => setName(e.target.value)}
    //                     />
    //                     <div className="name error red-text">{nameError}</div>
    //                     <label htmlFor="name">Name</label>
    //                 </div>

    //             </div>
    //             <div className="row">
    //                 <div className="input-field col s12">
    //                     <input id="email" type="email" className="validate"
    //                         value={email}
    //                         onChange={e => setEmail(e.target.value)}
    //                     />
    //                     <div className="email error red-text">{emailError}</div>
    //                     <label htmlFor="email">Email</label>
    //                 </div>
    //             </div>
    //             <div className="row">
    //                 <div className="input-field col s12">
    //                     <input id="password" type="password" className="validate"
    //                         value={password}
    //                         onChange={e => setPassword(e.target.value)}
    //                     />
    //                     <div className="password error red-text">{passwordError}</div>
    //                     <label htmlFor="password">Password</label>
    //                 </div>
    //             </div>

    //             <button className="btn">Sign up</button>
    //         </form>
    //     </div>

    // )
}

export default Signup
