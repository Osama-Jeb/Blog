import { deleteObject, ref } from "firebase/storage"
import { Post as PostProps } from "../constants/types"
import { db, storage } from "../firbase"
import { collection, deleteDoc, doc } from "firebase/firestore"
import { useInfo } from "../providers/InfoProvider"
import { useAuth } from "../providers/AuthProvider"
import Comments from "./Comments"

type PoP = {
    post: PostProps
}

const Post = (props: PoP) => {

    const { users } = useInfo();
    const { currentUser } = useAuth();

    const deletePost = async (post: PostProps) => {
        try {
            if (post.imageUrl) {
                const uuid = post.imageUrl.slice(77, 113);
                const imageRef = ref(storage, 'posts/' + uuid)
                deleteObject(imageRef).then(() => { console.log("image deleted") })

            }
            const postRef = doc(collection(db, 'posts'), post.id)
            await deleteDoc(postRef);

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className=" shadow-xl w-[50vw] bg-slate-300 rounded-xl">
            <p>{props.post.title}</p>
            <p>{props.post.content}</p>
            <p>{users?.[props.post.owner]?.email}</p>
            {
                props.post.imageUrl && <img src={props.post.imageUrl} width={200} alt={props.post.title} />
            }
            {
                props.post.owner == currentUser?.uid ?
                    <button onClick={() => { deletePost(props.post) }}>Delete Post</button>
                    :
                    null
            }
            <Comments post={props.post} />
        </div>
    )
}

export default Post