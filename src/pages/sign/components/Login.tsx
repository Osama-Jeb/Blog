import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../../firbase";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)

    }

    return (
        <>
            <div className="flex flex-col items-center gap-4">
                <input className="rounded w-full" placeholder="Email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} />
                <input className="rounded w-full" placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value) }} value={password} />
                <button className="bg-black text-white px-4 py-2 rounded w-full" onClick={signIn}>Sign In</button>
            </div>
        </>
    )
}

export default Login;