import { collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firbase";
import { Comment as CommentType } from "../constants/types";
import { useAuth } from "../providers/AuthProvider";
import { useInfo } from "../providers/InfoProvider";
import { FaRegTrashAlt, FaCheck } from "react-icons/fa";
import { LuPenLine } from "react-icons/lu";
import { useState } from "react";

type CoP = {
    comment: CommentType
}

const Comment = (props: CoP) => {

    const { currentUser } = useAuth();
    const { users } = useInfo()
    const commenter = users && Object.values(users).find(user => user.id === props.comment.owner);

    const [updatedComment, setUpdatedComment] = useState(props.comment.comment)
    const [isUpdating, setIsUpdating] = useState(false);

    const deleteComment = async (id: string) => {
        if (confirm("Delete This Comment ?")) {
            try {
                const commentRef = doc(collection(db, "comments"), id)
                await deleteDoc(commentRef);
            } catch (error) {
                console.log(error)
            }
        }
    }

    const updateComment = async (id: string) => {
        const newComment = {
            comment: updatedComment,
            updated_at: serverTimestamp()
        }

        try {
            const commentRef = doc(collection(db, "comments"), id)
            updateDoc(commentRef, newComment);
            setIsUpdating(false);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div key={props.comment.id} className="bg-gray-100 flex items-center justify-between rounded-md shadow-sm my-4 p-4">
            <div>
                <div className="flex items-center gap-3">
                    <img className="rounded-full w-6 h-6" src={commenter?.avatar} alt="" />
                    <p className="text-sm">{commenter?.username}</p>
                </div>
                <div className="w-full">
                    {
                        isUpdating ?
                            <input className="rounded ml-8 mt-1 w-full" type="text" value={updatedComment} onChange={(e) => { setUpdatedComment(e.target.value) }} />
                            :
                            <p className="ml-8 py-2 mt-1">{props.comment.comment}</p>
                    }
                </div>
            </div>
            {props.comment.owner === currentUser?.uid && (
                <div >
                    {
                        isUpdating ?
                            <>
                                <button className="text-green-600 text-lg " onClick={() => { updateComment(props.comment.id) }}>
                                    <FaCheck />
                                </button>
                            </>
                            :
                            <>
                                <button className="text-green-600 text-lg " onClick={() => { setIsUpdating(!isUpdating) }}>
                                    <LuPenLine />
                                </button>
                            </>
                    }
                    <button className="text-red-600 text-lg ml-2" onClick={() => { deleteComment(props.comment.id) }}>
                        <FaRegTrashAlt />
                    </button>
                </div>
            )}
        </div>
    )
}

export default Comment;