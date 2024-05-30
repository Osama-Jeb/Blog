import { collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firbase";
import { Comment as CommentType } from "../constants/types";
import { useAuth } from "../providers/AuthProvider";
import { useInfo } from "../providers/InfoProvider";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

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
        setShowMenu(false)
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

    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }


    return (
        <div key={props.comment.id} className="flex items-center justify-between rounded-md shadow-sm my-4 p-4">
            <div className="w-full">
                <div className="flex items-center gap-3">
                    <img className="rounded-full w-6 h-6" src={commenter?.avatar} alt="" />
                    <p className="text-sm">{commenter?.username}</p>
                </div>
                {
                    isUpdating ?
                        <div className="w-full flex items-center">
                            <input
                                className="ml-8 mt-1 w-[89%] bg-[#272727] text-white rounded-full " type="text"
                                value={updatedComment} onChange={(e) => { setUpdatedComment(e.target.value) }}

                            />
                            <div className="flex items-center gap-1">
                                <button
                                    className="text-2xl text-red-600"
                                    onClick={() => { setIsUpdating(false) }}
                                >
                                    <MdOutlineCancel />
                                </button>
                                <button
                                className="text-green-500 text-xl"
                                    onClick={() => { updateComment(props.comment.id) }}
                                >
                                    <FaRegCheckCircle />
                                </button>
                            </div>
                        </div>
                        :
                        <p className="ml-8 py-2 mt-1">{props.comment.comment}</p>
                }
            </div>
            {props.comment.owner === currentUser?.uid && (
                isUpdating ?
                    null
                    :
                    <div className="relative">
                        <button className="cursor-pointer hover:bg-[#333d42] p-1 rounded-full" onClick={toggleMenu}>
                        <BsThreeDotsVertical />

                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <button
                                    className="block w-full text-left rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                    onClick={() => { setIsUpdating(true); setShowMenu(false) }}
                                >
                                    Update Comment
                                </button>
                                <button
                                    className="block w-full text-left rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                    onClick={() => { deleteComment(props.comment.id) }}
                                >
                                    Delete Comment
                                </button>
                            </div>
                        )}
                    </div>
            )}
        </div>
    )
}

export default Comment;