import { useInfo } from "../providers/InfoProvider"
import { NavLink, useNavigate } from "react-router-dom"

import { Post as PostProps } from "../constants/types"
import UpvoteDownvote from "./UpvoteDownvote";
import Bookmark from "./Bookmark";
import Share from "./Share";

import { GoCommentDiscussion } from "react-icons/go";

import ReactPlayer from "react-player";
import { arrayUnion, collection, doc,getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firbase";
import { useState } from "react";


type PoP = {
    post: PostProps
}
const Post = (props: PoP) => {
    const { users, comments, user: currentUser } = useInfo();
    const owner = users && Object.values(users).find(user => user.id === props.post?.owner);

    const regex = /(<([^>]+)>)/gi;
    const postComments = comments?.filter(comment => comment.postID === props.post?.id);

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();


    // the id of the added user
    const handleChat = async (id: string | undefined) => {
        if (id) {
            setLoading(true);
            const chatRef = collection(db, 'chats');
            const userChatsRef = collection(db, 'userchats');


            try {

                const chatQuery = query(chatRef,
                    where('senderId', '==', currentUser.id),
                    where('senderId', '==', id)
                );

                const querySnapshot = await getDocs(chatQuery);

                if (querySnapshot.empty) {
                    // If chat exists, redirect to the chat page
                    setLoading(false);
                    navigate('/chat');
                    return;
                }




                const newChatRef = doc(chatRef);

                await setDoc(newChatRef, {
                    createdAt: serverTimestamp(),
                    messages: [],
                })

                // update the added user's userchats
                await updateDoc(doc(userChatsRef, id), {
                    chats: arrayUnion({
                        chatId: newChatRef.id,
                        lastMessage: '',
                        receiverId: currentUser.id,
                        updatedAt: Date.now()
                    })
                })


                // update the current user's userchats
                await updateDoc(doc(userChatsRef, currentUser.id), {
                    chats: arrayUnion({
                        chatId: newChatRef.id,
                        lastMessage: '',
                        receiverId: id,
                        updatedAt: Date.now()
                    })
                })

                setLoading(false)
                navigate('/chat')

            } catch (error) {
                console.log(error)
            }
        }
    }


    return (
        <div className="p-3 hover:bg-[#181c1f] rounded-xl">
            <div className="flex items-center justify-between mb-2 border-b-2 p-2 border-gray-500">

                <NavLink to={`/profile/${owner?.id}`} className="flex items-center gap-3 mb-2 w-fit">
                    <img loading="lazy" className="rounded-full aspect-square" src={owner?.avatar} width={35} alt="" />
                    <p>u/{owner?.username}</p>
                </NavLink>

                {
                    currentUser && currentUser?.id != owner?.id ?
                        <button
                            disabled={loading}
                            className="px-4 py-2 bg-black text-white rounded"
                            onClick={() => { handleChat(owner?.id) }}
                        >Go To Chat</button>
                        :
                        null
                }
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
                        <ReactPlayer pip={true} controls={true} width={350} url={props.post.imageUrl} />

                }
            </div>

            <div className="flex items-center gap-7 text-xl mt-3">

                <UpvoteDownvote post={props.post} />

                <NavLink to={`/post/${props.post?.id}`}>

                    <div className="flex items-center gap-1 bg-[#2a3236] px-3  py-1 hover:bg-[#333d42] rounded-full">
                        <GoCommentDiscussion />
                        {postComments?.length}
                    </div>
                </NavLink>

                <Share post={props.post} />

                <Bookmark post={props.post} />

            </div>
        </div>
    )
}

export default Post