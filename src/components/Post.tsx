import { Post as PostProps } from "../constants/types"

import { useInfo } from "../providers/InfoProvider"

import { GoCommentDiscussion } from "react-icons/go";

import { NavLink } from "react-router-dom"
import UpvoteDownvote from "./UpvoteDownvote";



import Bookmark from "./Bookmark";
import Share from "./Share";
import { formatDistanceToNow } from "date-fns";

type PoP = {
    post: PostProps
}

const Post = (props: PoP) => {

    const { users, comments } = useInfo();

    const owner = users && Object.values(users).find(user => user.id === props.post.owner);



    const regex = /(<([^>]+)>)/gi;
    const filteredComments = comments?.filter(comment => comment.postID === props.post.id);

    const datestring = props.post.created_at.toDate().toString();
    const formatted = props.post && formatDistanceToNow(new Date(datestring), { addSuffix: true });

    return (
        <div className="w-[60vw] p-3 hover:bg-[#181c1f] rounded-xl">
            <div className="flex items-center gap-3 mb-2">
                <img loading="lazy" className="rounded-full aspect-square" src={owner?.avatar} width={35} alt="" />
                <p>u/{owner?.username}</p>
                <p>{formatted}</p>
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
            <div className="flex items-center gap-7 text-xl mt-3 w-[50%]">

                <UpvoteDownvote post={props.post} />

                <NavLink to={`/post/${props.post.id}`}>

                    <div className="flex items-center gap-1 bg-[#2a3236] px-3  py-1 hover:bg-[#333d42] rounded-full">
                        <GoCommentDiscussion />
                        {filteredComments?.length}
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