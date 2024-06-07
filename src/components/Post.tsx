import { useInfo } from "../providers/InfoProvider"
import { NavLink } from "react-router-dom"

import { Post as PostProps } from "../constants/types"
import UpvoteDownvote from "./UpvoteDownvote";
import Bookmark from "./Bookmark";
import Share from "./Share";

import { GoCommentDiscussion } from "react-icons/go";

import ReactPlayer from "react-player";


type PoP = {
    post: PostProps
}
const Post = (props: PoP) => {
    const { users, comments } = useInfo();
    const owner = users && Object.values(users).find(user => user.id === props.post?.owner);

    const regex = /(<([^>]+)>)/gi;
    const postComments = comments?.filter(comment => comment.postID === props.post?.id);

    return (
        <div className="w-[60vw] p-3 hover:bg-[#181c1f] rounded-xl">
            <div className="flex items-center gap-3 mb-2">
                <img loading="lazy" className="rounded-full aspect-square" src={owner?.avatar} width={35} alt="" />
                <p>u/{owner?.username}</p>
                {/* <p>{formatted}</p> */}
            </div>

            <NavLink to={`/post/${props.post.id}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-2xl">{props.post.title.charAt(0).toUpperCase()}{props.post.title.slice(1)} </p>
                        <p>{props.post.content.replace(regex, "")}</p>
                    </div>
                </div>
            </NavLink>
            <div className="flex items-center justify-center mt-4">
                {
                    props.post.imageUrl?.includes('jpeg') ?
                        <img loading="lazy" src={props.post.imageUrl} className="rounded-xl" alt={props.post.title} />
                        :
                        <ReactPlayer pip={true} controls={true} url={props.post.imageUrl} />
                        
                }
            </div>

            <div className="flex items-center gap-7 text-xl mt-3 w-[50%]">

                <UpvoteDownvote post={props.post} />

                <NavLink to={`/post/${props.post.id}`}>

                    <div className="flex items-center gap-1 bg-[#2a3236] px-3  py-1 hover:bg-[#333d42] rounded-full">
                        <GoCommentDiscussion />
                        {postComments?.length}
                    </div>
                </NavLink>

                <Share post={props.post} />

                <Bookmark post={props.post} />

            </div>
            <hr className="mt-2" />
        </div>
    )
}

export default Post