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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addComment(props.post?.id);
        }
    };

    const sortedComments = comments?.sort((a, b) => a.created_at - b.created_at);


    const addComment = async (id?: string) => {

        if (!currentUser) {
            alert('Please Sign In or Create an Account')
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
            setComment('');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="flex items-center gap-3">
                <input className="w-[95%] p-2 rounded-xl" type="text" placeholder='Comment' value={comment}
                    onChange={(e) => { setComment(e.target.value) }}
                    onKeyDown={handleKeyDown} />

                <button className="text-3xl w-[5%]" onClick={() => { addComment(props.post?.id) }}>
                    <IoMdSend />
                </button>

            </div>
            {sortedComments && sortedComments.filter(comment => comment.postID === props.post?.id).map((element, index) => (
                <div key={index}>
                    <Comment comment={element} />
                </div>
            ))}

        </>
    )
}

export default Comments