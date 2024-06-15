import { useState } from "react";
import { db } from "../../../firbase";
import { collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Post } from "../../../constants/types";
import FileDisplay from "../../../components/FileDisplay";
import ReactPlayer from "react-player";
import Tiptap from "../../../components/Tiptap";
import { uploadFile } from "../../../constants/helperFunctions";


type UpdatePostProps = {
    post: Post,
    setIsUpdating: (arg0: boolean) => void;
}

const UpdatePost = (props : UpdatePostProps) => {

    // updating post 
    const [title, setTitle] = useState(props.post.title);
    const [content, setContent] = useState(props.post.content);
    const [image, setImage] = useState<any>(null);
    const [loading, setLoading] = useState(false);


    const handleUpdatePost = async (e:any, id: string) => {
        e.preventDefault()
        let imageUrl = "";

        if (image) {
            try {
                imageUrl = await uploadFile(image, setLoading);
            } catch (error) {
                console.error("Image upload failed", error);
                return;
            }
        }

        const newPost = {
            title: title,
            content: content,
            imageUrl: imageUrl || props.post.imageUrl,
            updated_at: serverTimestamp(),
        }

        try {
            const postRef = doc(collection(db, "posts"), id);
            updateDoc(postRef, newPost);
            props.setIsUpdating(false);
            setImage(null)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        props.setIsUpdating(false);
        setImage(null);
        setTitle(props.post.title);
        setContent(props.post.content)
    }
    return (
        <div className="flex justify-center min-h-[100vh] mt-3 p-4">
            <form className="flex items-center sm:w-[75vw] flex-col gap-3"
            onSubmit={(e) => {handleUpdatePost(e, props.post.id)}}
            >
                <button onClick={() => {handleCancel() }} className="px-4 py-2 bg-red-600 rounded">Cancel Update</button>
                <input className="bg-[#272727] w-full text-[#eef1f3] rounded-xl py-3" placeholder='Title' type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} />

                <Tiptap place="update" content={content ? content : ""} setContent={setContent} />

                <input className="w-full" type="file" onChange={(e) => { setImage(e.target.files ? e.target.files[0] : null) }} />

                <div className="flex w-full items-center justify-center mt-4">
                    {
                        image ?
                            <FileDisplay place="update" image={image} />
                            :

                            <>
                                {
                                    props.post.imageUrl?.includes('jpeg') ?
                                        <img loading="lazy" src={props.post.imageUrl} className="rounded-xl w-full" alt={props.post.title} />
                                        :
                                        <ReactPlayer controls={true} url={props.post.imageUrl} />
                                }
                            </>
                    }
                </div>

                <button
                    className="bg-green-500 w-full px-4 py-2 rounded"
                >

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
                                Update Post
                            </>
                    }
                </button>
            </form>
        </div>
    )
}

export default UpdatePost;