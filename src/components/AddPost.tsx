import { useState } from "react";
import {v4 as uuidv4} from "uuid"
import { useAuth } from "../providers/AuthProvider";
import { Post } from "../constants/types";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../firbase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const AddPost = () => {
    const {currentUser} = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const addPost = async () => {
        let imageUrl = '';

        if (!title) {
            alert("add title please")
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
            owner: currentUser.uid,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        };

        try {
            const postRef = doc(collection(db, 'posts'), newPost.id);
            await setDoc(postRef, newPost);

            setTitle('');
            setContent('');
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
            <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
                <input placeholder='title' type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                <input placeholder="content" type="text" value={content} onChange={(e) => { setContent(e.target.value) }} />

                <input type="file" onChange={(e) => { setImage(e.target.files ? e.target.files[0] : null) }} />

                <button disabled={loading} onClick={addPost}>Add Post</button>
            </div>
        </>
    )
}

export default AddPost;