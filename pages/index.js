import { useState } from "react";
import Header from "../lib/components/Header";
import NavCustom from "../lib/components/NavCustom";
import { useRouter } from "next/router";
import { auth, signInWithEmailAndPassword } from "../lib/firebase";


export default function Login()
{
  const router = useRouter();
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  async function handleEmailSignIn(e)
  {
    e.preventDefault();
    if (username.length === 0 || password.length === 0)
    {
      alert("Please enter your email and password");
    }
    else
    {
      try
      {
        const user = await signInWithEmailAndPassword(auth, username, password);
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/Dashboard';
      }
      catch (error)
      {
        alert("Invalid email or password");
      }
    }
  }
  return (
    <>
      <Header />
      <NavCustom />
      <div className="login-page">
        <h1>Login</h1>
        <form>
          <label>Email</label>
          <input type="text" placeholder="Email" onChange={(e) => setusername(e.target.value)} />

          <label>Password</label>
          <input type="password" placeholder="Password" onChange={(e) => setpassword(e.target.value)} />

          <button type='submit' className="submit" onClick={handleEmailSignIn}>Login</button>
          <p>Not a member?</p> <a href="/Signup">Sign Up</a>
        </form>
      </div>
    </>
  );
}