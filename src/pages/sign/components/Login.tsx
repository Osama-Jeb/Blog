import { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firbase";
import { Spinner } from "flowbite-react";

type LogProp = {
    setOpenModal: (openModal: boolean) => void;
}
const Login = (props: LogProp) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signIn = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        await signInWithEmailAndPassword(auth, email, password)
        setEmail('');
        setPassword('');
        setLoading(false);
        props.setOpenModal(false)
    }

    return (
        <form 
        onSubmit={signIn}
        className="flex flex-col items-center gap-4">
            <input
                className="w-full" placeholder="Email" type="email"
                onChange={(e) => { setEmail(e.target.value) }} value={email} />
            <input
                className="w-full" placeholder="Password" type="password"
                onChange={(e) => { setPassword(e.target.value) }} value={password} />

            <button
                disabled={loading}
                className="bg-black text-white px-4 py-2 w-full flex items-center justify-center gap-3"
                type="submit"
                >
                {
                    loading && <Spinner aria-label="spinner" />
                }
                Sign In
            </button>
        </form>
    )
}

export default Login;