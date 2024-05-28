import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firbase";
import { Comment as CommentType } from "../constants/types";
import { useAuth } from "../providers/AuthProvider";
import { useInfo } from "../providers/InfoProvider";
import { FaRegTrashAlt } from "react-icons/fa";

type CoP = {
    comment: CommentType
}

const Comment = (props: CoP) => {

    const { currentUser } = useAuth();
    const { users } = useInfo()
    const commenter = users && Object.values(users).find(user => user.id === props.comment.owner);


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

    return (
        <div key={props.comment.id} className="bg-gray-100 flex items-center justify-between rounded-md shadow-sm my-4 p-4">
            <div>
                <div className="flex items-center gap-3">
                    <img className="rounded-full w-6 h-6" src={commenter?.avatar} alt="" />
                    <p className="text-sm">{commenter?.username}</p>
                </div>
                <p className="ml-8 mt-1">{props.comment.comment}</p>
            </div>
            {props.comment.owner === currentUser?.uid && (
                <button className="text-red-600 text-sm mt-1" onClick={() => { deleteComment(props.comment.id) }}>
                    <FaRegTrashAlt />
                </button>
            )}
        </div>
    )
}

export default Comment;