import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firbase"
import { useAuth } from "../providers/AuthProvider";
import { collection, doc, setDoc } from "firebase/firestore";

const Login = () => {
    const { currentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const collectionRef = collection(db, 'users');

    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {

                const user = userCredential.user
                console.log(user);

                const newUser = {
                    id: user.uid,
                    email: user.email
                }

                const userRef = doc(collectionRef, newUser.id);
                await setDoc(userRef, newUser);
                console.log("user added");

            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleLogout = () => {
        auth.signOut()
    }

    return (
        <>
            <div>
                {
                    currentUser ?
                        <button onClick={handleLogout}>Sign Out</button>
                        :
                        <>
                            <input placeholder="Email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} />
                            <input placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value) }} value={password} />
                            <button onClick={register}>Register</button>
                        </>
                }
            </div>
        </>
    )
}

export default Login;