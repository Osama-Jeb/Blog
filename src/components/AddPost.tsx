import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

import { v4 as uuidv4 } from "uuid"

import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../firbase";
import { StorageReference, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { Post } from "../constants/types";
import Tiptap from "./Tiptap";
import PrivateRoute from "../providers/PrivateRouter";
import FileDisplay from "./FileDisplay";



const AddPost = () => {
    const { currentUser } = useAuth();

    // Inputs
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('<p>Write Something Here</p>');
    const [image, setImage] = useState<File | null>(null);
    // loading for uploading an image
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const uploadFile = async (): Promise<string> => {
        if (image) {
            setLoading(true);
            let imageRef : StorageReference;
            
            // add an extension depending on the file format
            if (image.type.startsWith('image')) {
                imageRef = ref(storage, `posts/${uuidv4()}.jpeg`);
            } else if (image.type.startsWith('video')) {
                imageRef = ref(storage, `posts/${uuidv4()}.mp4`);
            } else {
                alert('file type not supported')
                throw Error('File Type Not Supported')
            }

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
            return ""
        }
    }

    const addPost = async () => {
        let fileUrl = '';

        if (!currentUser) {
            alert('Please Sign In or Create an Account')
        }

        if (!title) {
            alert("add title and content please")
            return
        }

        if (image) {
            try {
                fileUrl = await uploadFile();
            } catch (error) {
                console.error("Image upload failed", error);
                return;
            }
        }

        const newPost: Post = {
            id: uuidv4(),
            title,
            content,
            imageUrl : fileUrl,
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
            navigate('/')
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <PrivateRoute>
            <div className="flex flex-col items-center gap-7 justify-center p-5 min-h-[100vh]">
                <p className="text-xl font-semibold">Create Your Post Here: </p>
                <input
                    className="bg-[#272727] text-[#eef1f3] rounded-full py-3 w-[52%]"
                    placeholder='Title' type="text" value={title}
                    onChange={(e) => { setTitle(e.target.value) }} />

                <Tiptap content={content} setContent={setContent} />

                <input className="w-[51%]" type="file"
                    onChange={(e) => { setImage(e.target.files ? e.target.files[0] : null) }} />

                {
                    image && <FileDisplay image={image} />
                }

                <button className="bg-blue-500 font-semibold text-white px-4 py-2 rounded w-[50%] mt-2"
                    disabled={loading}
                    onClick={addPost}>

                    {
                        loading ?
                            <div role="status" className="flex items-center justify-center gap-3">
                                <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <p>....Loading</p>
                            </div>
                            :
                            <>
                                Post
                            </>
                    }
                </button>
            </div>
        </PrivateRoute>
    )
}

export default AddPost;