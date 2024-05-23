import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firbase";
import { Comment as CommentType } from "../constants/types";
import { useAuth } from "../providers/AuthProvider";

type CoP = {
    comment : CommentType
}

const Comment = (props : CoP) => {

    const {currentUser} = useAuth();

    const deleteComment = async (id : string) => {
        try {
            const commentRef = doc(collection(db, "comments"), id)
            await deleteDoc(commentRef);
        } catch (error) {
            console.log(error)
        }
    }

    return (
            <div key={props.comment.id}>
                <p>{props.comment.comment}</p>
                {
                    props.comment.owner == currentUser?.uid ?
                        <button onClick={() => { deleteComment(props.comment.id) }}>Delete Comment</button>
                        :
                        null
                }
            </div>
    )
}

export default Comment;