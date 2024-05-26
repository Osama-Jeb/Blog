import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firbase";
import { Comment as CommentType } from "../constants/types";
import { useAuth } from "../providers/AuthProvider";
import { useInfo } from "../providers/InfoProvider";

type CoP = {
    comment: CommentType
}

const Comment = (props: CoP) => {

    const { currentUser } = useAuth();
    const { users } = useInfo()
    const commenter = users && Object.values(users).find(user => user.id === props.comment.owner);


    const deleteComment = async (id: string) => {
        try {
            const commentRef = doc(collection(db, "comments"), id)
            await deleteDoc(commentRef);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div key={props.comment.id}>
            <div className="flex items-center gap-3 p-2">
                <img className="rounded-full aspect-square" src={commenter?.avatar} width={25} alt="" />
                <p>{commenter?.username}</p>
            </div>
            <p className="ml-[35px]">{props.comment.comment}</p>
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