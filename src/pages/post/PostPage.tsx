import { useParams } from "react-router-dom";
import { useInfo } from "../../providers/InfoProvider";
import { useAuth } from "../../providers/AuthProvider";
import { Post as PostProps } from "../../constants/types"
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../firbase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import Comments from "../../components/Comments";

const PostPage = () => {
    const id = useParams();
    const { posts } = useInfo();
    const {currentUser} = useAuth()
    const myPost = posts?.filter(post => post.id === id.id)[0];


    const deletePost = async (post: PostProps | undefined) => {
        if (confirm("Are You Sure You Want To Delete This Post")) {
            try {
                if (post?.imageUrl) {
                    const uuid = post?.imageUrl.slice(77, 113);
                    const imageRef = ref(storage, 'posts/' + uuid)
                    deleteObject(imageRef).then(() => { console.log("image deleted") })

                }
                const postRef = doc(collection(db, 'posts'), post?.id)
                await deleteDoc(postRef);

            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <>
            <div className=" shadow-xl w-[50vw] bg-slate-300 rounded-xl p-3">
                <p>{myPost?.created_at.toDate().toString().slice(0, 24)}</p>
                <span className="float-right">
                    {
                        myPost?.owner == currentUser?.uid ?
                            <button className="bg-black text-white rounded px-3 py-1 " onClick={() => { deletePost(myPost) }}>Delete Post</button>
                            :
                            null
                    }
                </span>

                <div>
                    <p>{myPost?.title}</p>
                </div>

                <Comments post={myPost} />
            </div>
        </>
    )
}

export default PostPage;