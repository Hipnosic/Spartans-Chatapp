import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import Chat from './components/chat/Chat';
import Home from './components/home/Home';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
// The App component uses React hooks, specifically useState and useEffect, to manage state and side effects in the component.
function App() {
  // The useState hook is used to declare a state variable user and a corresponding setter function setUser, with an initial value of null. This allows the component to store and update the state of the currently logged-in user.
  const [user, setUser] = useState(null)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/verifyuser', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log("Hoppsan något gick snett!: ", error)
      }
    }
    verifyUser()
  }, [])

  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/chat/:room_id/:room_name" element={ <Chat />} />
            <Route path="/signup" element={ <Signup />} />
            <Route path="/login" element={ <Login />} />
          </Routes>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
