import { Post as PostProps } from "../constants/types"

import { useInfo } from "../providers/InfoProvider"

import { GoCommentDiscussion } from "react-icons/go";

import { NavLink } from "react-router-dom"
import UpvoteDownvote from "./UpvoteDownvote";



import Bookmark from "./Bookmark";
import Share from "./Share";

type PoP = {
    post: PostProps
}

const Post = (props: PoP) => {

    const { users, comments } = useInfo();

    const owner = users && Object.values(users).find(user => user.id === props.post.owner);



    const regex = /(<([^>]+)>)/gi;
    const filteredComments = comments?.filter(comment => comment.postID === props.post.id);



    return (
        <div className="shadow-xl w-[50vw] bg-gray-200 rounded-xl p-3">
            <div className="flex items-center gap-3">
                <img loading="lazy" className="rounded-full aspect-square" src={owner?.avatar} width={35} alt="" />
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

                <Share post={props.post} />

                <Bookmark post={props.post} />

            </div>
        </div>
    )
}

export default Post