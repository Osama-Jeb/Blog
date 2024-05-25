import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firbase";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"

const Sign = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    // photoUrl
    const [image, setImage] = useState<File | null>(null);

    const [newOld, setNewOld] = useState(false);


    const uploadImage = async (): Promise<string> => {
        if (image) {
            setLoading(true);
            const imageRef = ref(storage, `avatars/${uuidv4()}`);

            try {
                const snapshot = await uploadBytes(imageRef, image);
                const url = await getDownloadURL(snapshot.ref);
                setLoading(false);
                return url;
            } catch (error) {
                console.error(error);
                setLoading(false);
                throw error;
            }
        } else {
            return "https://firebasestorage.googleapis.com/v0/b/blog-ea5da.appspot.com/o/posts%2Favatars%2FuserAvatar.png?alt=media&token=1d3c9557-3f4f-4f74-add6-fac644d40eb2";
        }
    }

    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {

                const user = userCredential.user
                console.log(user);
                const avatarUrl = await uploadImage();

                const newUser = {
                    id: user.uid,
                    email: user.email,
                    username: username,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp(),
                    avatar: avatarUrl,
                    bookmark: []
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
                                <input type="file" onChange={(e) => { setImage(e.target.files ? e.target.files[0] : null) }} />
                                <input type="text" placeholder="Username" onChange={(e) => { setUsername(e.target.value) }} value={username} required />
                                <input placeholder="Email" type="email" onChange={(e) => { setEmail(e.target.value) }} value={email} required />
                                <input placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value) }} value={password} required />
                                <button className="bg-black text-white px-4 py-2 rounded" disabled={loading} onClick={register}>

                                    {
                                        loading ?
                                            <>
                                                <div role="status" className="flex items-center justify-center gap-3">
                                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                    </svg>
                                                    <p>....Creating Account</p>
                                                </div>
                                            </>
                                            :
                                            <>
                                                Register
                                            </>
                                    }
                                </button>
                                <p>Already Have an Account ? <button className="underline font-semibold cursor-pointer" onClick={() => { setNewOld(true) }}>Sign In</button></p>
                            </div>
                }
            </div>
        </div>
    )
}

export default Sign;