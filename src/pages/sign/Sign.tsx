import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firbase";
import { collection, doc, setDoc } from "firebase/firestore";

const Sign = () => {
    const { currentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [newOld, setNewOld] = useState(false);

    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {

                const user = userCredential.user
                console.log(user);

                const newUser = {
                    id: user.uid,
                    email: user.email
                }

                const userRef = doc(collection(db, 'users'), newUser.id);
                await setDoc(userRef, newUser);
                console.log("user added");

            })
            .catch((error) => {
                console.log(error)
            })
    }

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)

    }

    const handleLogout = () => {
        auth.signOut()
    }

    return (
        <div className="flex items-center justify-center h-[100vh]">
            <div>
                {
                    currentUser ?
                        <button className="bg-red-600 px-4 py-2 rounded text-white font-semibold" onClick={handleLogout}>Sign Out</button>
                        : newOld ?
                            <div className="flex flex-col items-center gap-4">
                                <input placeholder="Email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} />
                                <input placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value) }} value={password} />
                                <button onClick={signIn}>Sign In</button>
                                <p>Create New Account ? <button className="underline font-semibold cursor-pointer" onClick={() => { setNewOld(false) }}>Register</button></p>
                            </div>
                            :
                            <div className="flex flex-col items-center gap-4">
                                <input placeholder="Email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} />
                                <input placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value) }} value={password} />
                                <button onClick={register}>Register</button>
                                <p>Already Have an Account ? <button className="underline font-semibold cursor-pointer" onClick={() => { setNewOld(true) }}>Sign In</button></p>
                            </div>
                }
            </div>
        </div>
    )
}

export default Sign;