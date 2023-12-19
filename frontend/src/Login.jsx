import React, {useState} from 'react';
 
import { Link, useNavigate } from 'react-router-dom';
import { login, checkUser } from './api/apiAuth';

export default function Login(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    async function submitForm(e) {
        e.preventDefault();
        if(pass.length < 8){
            alert('Password must be at least 8 characters');
            return false
        }
        if(user != ""){
            let res = await checkUser(user);
            if (res === true){
                await login(user, pass);
                props.setLogin(true);
                setPass('');
                return navigate('/');
            } else {
                alert('Username not found!');
            }
            
        } else {
            alert("Please enter username");
        }
    }

    function inputChange(e) {
        switch (e.target.name) {
            case 'username':
                setUser(e.target.value);
                break;
            case 'pass':
                setPass(e.target.value);
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
                </span>
                <button className='btn'>Login</button>
                <Link to='/login/register' className='btn' id='reggie'>Register</Link>
            </form>
        </>
    )
}
