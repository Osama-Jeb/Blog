import { useState } from "react";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../../firbase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

type RegProp = {
    setOpenModal: (openModal: boolean) => void;
}

const Register = (props: RegProp) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file (PNG or JPEG/JPG).');
                return;
            }

            // file size
            const maxSizeInBytes = 2 * 1024 * 1024; // 2 megabytes
            if (file.size > maxSizeInBytes) {
                alert('Please select a file smaller than 2 megabytes.');
                return;
            }

            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


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
            return "https://firebasestorage.googleapis.com/v0/b/blog-ea5da.appspot.com/o/avatars%2FuserAvatar.png?alt=media&token=c24214a3-b611-42df-889b-66f8b314ed27";
        }
    }

    const register = (e: any) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                const avatarUrl = await uploadImage();

                const newUser = {
                    id: user.uid,
                    email: user.email,
                    username: username,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp(),
                    avatar: avatarUrl,
                    bookmark: [],
                    blocked: []
                };

                const userRef = doc(collection(db, 'users'), newUser.id);
                await setDoc(userRef, newUser);

                await setDoc(doc(db, "userchats", user.uid), {
                    chats: [],
                });

                props.setOpenModal(false)

                toast.success("Account created!!");

            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <form 
            onSubmit={register}
            className="flex flex-col items-center gap-4 ">
                <label htmlFor="file-input" className="flex items-center justify-center w-20 text-5xl font-bold h-20 bg-black text-white rounded-full cursor-pointer">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Selected" className="w-20 h-20 rounded-full aspect-square" />
                    ) : (
                        '+'
                    )}
                </label>
                <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                />

                <input className="w-full rounded" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username} required />
                <input className="w-full rounded" placeholder="example@email.com" type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                <input className="w-full rounded" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />

                <button className="w-full bg-black text-white px-4 py-2 rounded" disabled={loading} 
                type="submit"
                >
                    {loading ? (
                        <div role="status" className="flex items-center justify-center gap-3">
                            <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <p>....Creating Account</p>
                        </div>
                    ) : (
                        'Register'
                    )}
                </button>
            </form>
        </>
    )
}

export default Register;
