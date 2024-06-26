import { useInfo } from "../providers/InfoProvider"
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";

import Comment from "./Comment";
import { Post as PostProps } from "../constants/types"
import { v4 as uuidv4 } from "uuid"

import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firbase";

import { IoMdSend } from "react-icons/io";


type PoP = {
    post: PostProps | undefined
}
const Comments = (props: PoP) => {
    const [comment, setComment] = useState('');
    const { comments } = useInfo();
    const { currentUser } = useAuth();

    const sortedComments = comments?.filter(comment => comment.postID === props.post?.id).sort((a, b) => a.created_at - b.created_at);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addComment(props.post?.id);
        }
    };

    const addComment = async (e: any, id?: string) => {
        e.preventDefault();

        if (!currentUser) {
            alert('Please Sign In or Create an Account')
            return;
        }

        if (!comment) {
            return;
        }

        const newComment = {
            id: uuidv4(),
            comment: comment,
            owner: currentUser?.uid,
            postID: id,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        }

        try {
            const commentRef = doc(collection(db, "comments"), newComment.id);
            await setDoc(commentRef, newComment);
        } catch (error) {
            console.log(error)
        }
        setComment('');
    }

    return (
        <>
            <form className="flex items-center gap-3 text-white mt-3" onSubmit={(e) => { addComment(e, props.post?.id) }}>
                <input
                    type="text" placeholder='  Comment' value={comment}
                    className="w-full p-2 rounded-full bg-[#272727]"
                    onChange={(e) => { setComment(e.target.value) }}
                    onKeyDown={handleKeyDown} />

                <button className="text-3xl"
                >
                    <IoMdSend />
                </button>

            </form>
            {sortedComments && sortedComments.map((element, index) => (
                <div key={index}>
                    <Comment comment={element} />
                </div>
            ))}

        </>
    )
}

export default Comments