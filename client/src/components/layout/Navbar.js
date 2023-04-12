import React, { useContext } from 'react'
import { UserContext } from '../../UserContext';
import SignedInMenu from './SignedInMenu';
import SignedOutMenu from './SignedOutMenu';
const Navbar = () => {
    // The Navbar component uses the useContext hook to access the user and setUser variables from a UserContext context. It defines a logout function that makes an asynchronous HTTP request to a local server at http://localhost:5000/logout with credentials included. Upon a successful response, it calls setUser(null) to update the user state to null, effectively logging out the user. Any errors that occur during the fetch request are logged to the console.
    const { user, setUser } = useContext(UserContext);

    const logout = async () => {
        try {
            const res = await fetch('http://localhost:5000/logout', {
                credentials: 'include',
            });
            const data = res.json();
            console.log('logout data', data);
            setUser(null)
        } catch (error) {
            console.log(error)
        }

    }
    // The items in the navigation bar are conditionally rendered based on the user state. If user is truthy, it renders a component SignedInMenu with the logout function passed as a prop, otherwise it renders a component SignedOutMenu.
    const menu = user ? <SignedInMenu logout={logout} /> : <SignedOutMenu />
    return (
        <>
            <nav className="green">
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">Chat</a>
                    <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>


                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {menu}

                    </ul>
                </div>
            </nav>
            <ul className="sidenav" id="mobile-demo">
                {menu}
            </ul>
        </>

    )
}

export default Navbar
