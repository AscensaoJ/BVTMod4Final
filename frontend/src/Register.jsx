import React, {useState} from 'react';
 
import { Link, useNavigate } from 'react-router-dom';
import { checker, checkUser, register } from './api/apiAuth';
import { useEffect } from 'react';

export default function Register(props) {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [pass2, setPass2] = useState("");
    const [match, setMatch] = useState(true);

    async function submitForm(e) {
        e.preventDefault();
        if(pass.length < 8){
            alert('Password must be at least 8 characters');
            return false
        }
        if(user != ""){
            let res = await checkUser(user);
            if (res === true){
                const bob = await register(user, pass);
                props.setUserData({
                    username: bob.username,
                    loggedIn: true,
                    total: bob.questions,
                    correct: bob.correct
                });
                setPass('');
                return navigate('/');
            } else {
                alert('Username not found!');
            }
            
        } else {
            alert("Please enter username");
        }
    }

    useEffect(() => {
        setMatch(checker(pass, pass2));
    }, [pass, pass2])

    function inputChange(e) {
        switch (e.target.name) {
            case 'username':
                setUser(e.target.value);
                break;
            case 'pass':
                setPass(e.target.value);
                break;
            case 'pass2':
                setPass2(e.target.value);
                break;
            default:
                break;
        }
        
    }

    return (
        <>
            <form method="post" id="login-container" onSubmit={submitForm}>
                <span className="header">Sign In</span>
                <span className="login-content">
                    <input
                        type="text"
                        name="username"
                        className="login-content"
                        placeholder="Username"
                        onChange={inputChange}
                        value={user}
                    />
                    <input
                        type="password"
                        name="pass"
                        className="login-content"
                        id="pass"
                        placeholder="Password"
                        minLength="8"
                        onChange={inputChange}
                    />
                    <input
                        type="password"
                        name="pass2"
                        className="login-content"
                        id="pass2"
                        placeholder="Re-enter Password"
                        minLength="8"
                        onChange={inputChange}
                    />
                </span>
                {match && <button id='sub' className='btn'>Register</button>}
                {!match && <p id='passMatch'>Passwords do not match!</p>}
            </form>
            {/* <button onClick={() => tester('Jack', 'passwort', 'register')}>tester</button> */}
        </>
    )
}