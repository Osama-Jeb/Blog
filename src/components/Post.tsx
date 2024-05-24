import { Post as PostProps } from "../constants/types"
import { db } from "../firbase"
import { arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { useInfo } from "../providers/InfoProvider"
import { GoCommentDiscussion } from "react-icons/go";
import { CiShare2 } from "react-icons/ci";

import { FaBookmark } from "react-icons/fa";
import { CiBookmarkPlus } from "react-icons/ci";
import { TbArrowBigUpLineFilled, TbArrowBigDownLineFilled } from "react-icons/tb";
import { NavLink } from "react-router-dom"
import { useAuth } from "../providers/AuthProvider"


type PoP = {
    post: PostProps
}

const Post = (props: PoP) => {

    const { users, comments } = useInfo();
    const {currentUser} = useAuth()
    const user = Object.values(users).find(user => user.id === currentUser.uid);

    


    const regex = /(<([^>]+)>)/gi;
    const filteredComments = comments?.filter(comment => comment.postID === props.post.id);

    const bookmark = async () => {
        try {
            const userRef = doc(collection(db, 'users'), currentUser.uid)
            const userDoc = await getDoc(userRef);


            if (userDoc.exists()) {
                const userData = userDoc.data();
                const currentBookmarks = userData.bookmark || [];

                if (currentBookmarks.includes(props.post.id)) {
                    // Remove the post from bookmarks
                    await updateDoc(userRef, {
                        bookmark: arrayRemove(props.post.id),
                    });
                } else {
                    // Add the post to bookmarks
                    await updateDoc(userRef, {
                        bookmark: arrayUnion(props.post.id),
                    });
                }
            } else {
                console.log('User document not found');
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (


        <div className="shadow-xl w-[50vw] bg-gray-200 rounded-xl p-3">
            <NavLink to={`/post/${props.post.id}`}>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-2xl">{props.post.title.charAt(0).toUpperCase()}{props.post.title.slice(1)} </p>
                        <p>{props.post.content.replace(regex, "")}</p>
                    </div>
                    {
                        props.post.imageUrl && <img src={props.post.imageUrl} width={200} className="rounded-xl" alt={props.post.title} />
                    }
                </div>
            </NavLink>
            <hr />
            <div className="flex items-center gap-7 text-xl">
                <div className="flex items-center p-2 gap-1">
                    <button>
                        <TbArrowBigUpLineFilled />
                    </button>

                    <span>0</span>

                    <button>
                        <TbArrowBigDownLineFilled />
                    </button>

                </div>

                <NavLink to={`/post/${props.post.id}`}>

                    <div className="flex items-center gap-1 hover:bg-gray-400 p-1 rounded">
                        <GoCommentDiscussion />
                        {filteredComments?.length}
                    </div>
                </NavLink>

                <div>
                    <CiShare2 />
                </div>

                <button onClick={bookmark}>
                    {
                        user?.bookmark?.includes(props.post.id) ?
                            <>
                                <FaBookmark />

                            </>
                            :
                            <>
                                <CiBookmarkPlus />
                            </>
                    }
                </button>
            </div>
        </div>
    )
}

export default Post