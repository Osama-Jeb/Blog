import { useInfo } from "../providers/InfoProvider"
import { Post as PostProps } from "../constants/types"
import Comment from "./Comment";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import {v4 as uuidv4} from "uuid"
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firbase";

type PoP = {
    post: PostProps
}

const Comments = (props: PoP) => {
    const [comment, setComment] = useState('');
    const { comments } = useInfo();
    const {currentUser} = useAuth();

    const addComment = async (id: string) => {
        const newComment = {
            id: uuidv4(),
            comment: comment,
            owner: currentUser.uid,
            postID: id,
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
            {comments && comments.filter(comment => comment.postID === props.post.id).map((element, index) => (
                <div key={index}>
                    <Comment comment={element} />
                </div>
            ))}

            <div>
                <input type="text" placeholder='Comment' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                <button onClick={() => { addComment(props.post.id) }}>Comment</button>
            </div>
        </>
    )
}

export default Comments