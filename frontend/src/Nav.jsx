import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from './api/apiAuth';

// Navbar
export default function Nav(props) {

    // Handles local logout
    function logoutBtn () {
        if (logout()) {
            props.setLogin(false)
            navigate('/')
        }
    }

    return (
            <nav>
                <div className='btn-grp' role='group'>
                    <Link draggable='false' className='btn btn-nav' to='/'>Home</Link>
                    <Link draggable='false' className='btn btn-nav' to='/about'>About</Link>
                    {!props.userData.loggedIn && <Link draggable='false' className='btn btn-nav' to='/login'>Login</Link>}
                    {props.userData.loggedIn && <button onClick={logoutBtn} draggable='false' className='btn btn-nav'>Logout</button>}
                </div>
            </nav>
    )
}

//<button href="/login" className='btn' id="loginBtn">login</button>
//<button href="/" className='btn' id="home">Home</button>
//<button href="/about" className='btn' id="about">About</button>
