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
            <div className="flex flex-col items-center gap-4 w-[50%]">
                <input className="w-[50%] rounded" placeholder="Email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} />
                <input className="w-[50%] rounded" placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value) }} value={password} />
                <button className="w-[50%] bg-black text-white px-4 py-2 rounded" onClick={signIn}>Sign In</button>
            </div>
        </>
    )
}

export default Login;