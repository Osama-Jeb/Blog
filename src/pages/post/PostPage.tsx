import { NavLink, useParams } from "react-router-dom";
import { useInfo } from "../../providers/InfoProvider";
import { useAuth } from "../../providers/AuthProvider";
import { Post as PostProps } from "../../constants/types"
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../firbase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import Comments from "../../components/Comments";
import Share from "../../components/Share";

import { BsThreeDotsVertical } from "react-icons/bs";
import UpvoteDownvote from "../../components/UpvoteDownvote";
import { GoCommentDiscussion } from "react-icons/go";
import Bookmark from "../../components/Bookmark";

import { formatDistanceToNow } from "date-fns";

const PostPage = () => {
    const id = useParams();
    const { users, posts, comments } = useInfo();
    const { currentUser } = useAuth();
    const myPost = posts?.filter(post => post.id === id.id)[0];

    const filteredComments = comments?.filter(comment => comment.postID === myPost?.id);

    const owner = users && Object.values(users).find(user => user.id === myPost?.owner);


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

    const datestring = myPost?.created_at.toDate().toString();
    const formatted = myPost && formatDistanceToNow(new Date(datestring), { addSuffix: true });
    return (
        <>
            <div className=" shadow-xl w-[65vw] bg-slate-300 rounded-xl p-3">
                <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                        <img loading="lazy" className="rounded-full aspect-square" src={owner?.avatar} width={35} alt="user avatar" />
                        <p>{owner?.username}</p>
                        <p>{formatted}</p>
                    </div>
                    <button className="">
                        {
                            myPost?.owner == currentUser?.uid ?
                                <button className="bg-black text-white rounded px-3 py-1 " onClick={() => { deletePost(myPost) }}>Delete Post</button>
                                :
                                null
                        }
                        <BsThreeDotsVertical />
                    </button>
                </div>

                {
                    myPost?.imageUrl && <img loading="lazy" src={myPost?.imageUrl} className="rounded-xl w-full h-[350px]" alt={myPost?.title} />
                }
                <div className="p-4">
                    <p className="text-3xl font-bold">{myPost?.title}</p>
                    <br />

                    {myPost?.content && (
                        <p className="text-lg" dangerouslySetInnerHTML={{ __html: myPost.content }}></p>
                    )}
                </div>

                <div className="flex items-center gap-7 text-xl p-2">

                    <UpvoteDownvote post={myPost} />

                    <NavLink to={`/post/${myPost?.id}`}>

                        <div className="flex items-center gap-1 hover:bg-gray-400 p-1 rounded">
                            <GoCommentDiscussion />
                            {filteredComments?.length}
                        </div>
                    </NavLink>

                    <div>


                        <Share post={myPost} />


                    </div>

                    <Bookmark post={myPost} />
                </div>
                <Comments post={myPost} />
            </div>
        </>
    )
}

export default PostPage;