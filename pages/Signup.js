import Header from '../lib/components/Header';
import NavCustom from '../lib/components/NavCustom';
import { useState } from 'react';
import { createUserWithEmailAndPassword,auth } from '../lib/firebase'

export default function Signup()
{
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    function validEmail(email)
    {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    async function handleSubmit(e)
    {
        e.preventDefault();
        if (!validEmail(username))
        {
            alert('Invalid Email');
        }
        else if (password.length < 4)
        {
            alert('Password must be at least 4 characters');
            return;
        }
        else
        {
            try
            {
                const user = await createUserWithEmailAndPassword(auth, username, password);
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/Dashboard';
            }
            catch (err)
            {
                alert(err);
            }
        }
    }

    return (
        <div>
            <Header />
            <NavCustom />
            <div className="signup-page">
                <h1>Signup</h1>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" placeholder="Email" onChange={(e) => setusername(e.target.value)} />

                    <label>Password</label>
                    <input type="password" placeholder="Password" onChange={(e) => setpassword(e.target.value)} />
                    
                    <button type='submit' className='submit' onClick={handleSubmit}>Sign up</button>
                    <p>Already a member?</p><a href="/">Login</a>
                </form>
            </div>
        </div>
    );
}