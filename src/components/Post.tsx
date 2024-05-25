import { Post as PostProps } from "../constants/types"

import { db } from "../firbase"
import { arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore"

import { useInfo } from "../providers/InfoProvider"
import { useAuth } from "../providers/AuthProvider"

import { GoCommentDiscussion } from "react-icons/go";
import { CiShare2 } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { CiBookmarkPlus } from "react-icons/ci";

import { NavLink } from "react-router-dom"
import UpvoteDownvote from "./UpvoteDownvote";


import {
    FacebookShareButton,
    FacebookIcon
} from "react-share";

type PoP = {
    post: PostProps
}

const Post = (props: PoP) => {

    const { users, comments } = useInfo();
    const { currentUser } = useAuth()
    const user = users && Object.values(users).find(user => user.id === currentUser?.uid);
    const owner = users && Object.values(users).find(user => user.id === props.post.owner);



    const regex = /(<([^>]+)>)/gi;
    const filteredComments = comments?.filter(comment => comment.postID === props.post.id);

    const bookmark = async () => {
        try {
            const userRef = doc(collection(db, 'users'), currentUser?.uid)
            const userDoc = await getDoc(userRef);


            if (userDoc.exists()) {
                const userData = userDoc.data();
                const currentBookmarks = userData.bookmark || [];

                if (currentBookmarks.includes(props.post.id)) {
                    // remove the post from bookmarks
                    await updateDoc(userRef, {
                        bookmark: arrayRemove(props.post.id),
                    });
                } else {
                    // add the post to bookmarks
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
            <div className="flex items-center gap-3">
                <img className="rounded-full aspect-square" src={owner?.avatar} width={35} alt="" />
                <p>{owner?.username}</p>
            </div>
            <NavLink to={`/post/${props.post.id}`}>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-2xl">{props.post.title.charAt(0).toUpperCase()}{props.post.title.slice(1)} </p>
                        <p>{props.post.content.replace(regex, "")}</p>
                    </div>
                    {
                        props.post.imageUrl && <img loading="lazy" src={props.post.imageUrl} width={200} className="rounded-xl" alt={props.post.title} />
                    }
                </div>
            </NavLink>
            <hr />
            <div className="flex items-center gap-7 text-xl">

                <UpvoteDownvote post={props.post} />

                <NavLink to={`/post/${props.post.id}`}>

                    <div className="flex items-center gap-1 hover:bg-gray-400 p-1 rounded">
                        <GoCommentDiscussion />
                        {filteredComments?.length}
                    </div>
                </NavLink>

                <div>
                    <CiShare2 />

                    <FacebookShareButton url={`https://myblogproject.vercel.app/post/${props.post.id}`} >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>


                </div>

                <button onClick={bookmark}>
                    {
                        user?.bookmark.includes(props.post.id) ?
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