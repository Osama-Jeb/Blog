import { useState } from "react";
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "../providers/AuthProvider";
import { Post } from "../constants/types";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../firbase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Tiptap from "./Tiptap";



const AddPost = () => {
    const { currentUser } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('<p>Write Something Here</p>');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const addPost = async () => {
        let imageUrl = '';

        if (!title || !content) {
            alert("add title and content please")
            return
        }

        if (image) {
            try {
                imageUrl = await uploadImage();
            } catch (error) {
                console.error("Image upload failed", error);
                return;
            }
        }

        const newPost: Post = {
            id: uuidv4(),
            title,
            content,
            imageUrl,
            owner: currentUser?.uid,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            upvotes: [],
            downvotes: []
        };

        try {
            const postRef = doc(collection(db, 'posts'), newPost.id);
            await setDoc(postRef, newPost);

            setTitle('');
            setContent('');
            window.location.reload()
        } catch (error) {
            console.error(error);
        }
    }


    const uploadImage = async (): Promise<string> => {
        if (!image) {
            alert("Add an image!");
            throw new Error("No image provided");
        }
        setLoading(true);
        const imageRef = ref(storage, `posts/${uuidv4()}`);

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
    }

    return (
        <>
            <div className="addPost flex flex-col items-center gap-4 h-[100vh] justify-center w-[100vw]">
                <input className=" border-2 border-gray-600 p-2 rounded-xl w-[50%]" placeholder='Title' type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} />

                <Tiptap setContent={setContent} />

                    <input className=" w-[50%]" type="file" onChange={(e) => { setImage(e.target.files ? e.target.files[0] : null) }} />

                {
                    image && <img src={URL.createObjectURL(image)} className="w-[50%] h-[40vh] aspect-square rounded-xl" alt="" />
                }

                <button className="bg-black text-white px-4 py-2 rounded w-[50%] mt-2" disabled={loading} onClick={addPost}>

                    {
                        loading ?
                            <>
                                <div role="status" className="flex items-center justify-center gap-3">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <p>....Loading</p>
                                </div>
                            </>
                            :
                            <>
                                Add Post
                            </>
                    }
                </button>
            </div>
        </>
    )
}

export default AddPost;