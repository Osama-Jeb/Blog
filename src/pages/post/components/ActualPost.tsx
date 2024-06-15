import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";
import { useInfo } from "../../../providers/InfoProvider";
import { Post } from "../../../constants/types";

import UpvoteDownvote from "../../../components/UpvoteDownvote";
import Share from "../../../components/Share";
import Bookmark from "../../../components/Bookmark";
import Comments from "../../../components/Comments";

import ReactPlayer from "react-player";

import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../../firbase";
import { collection, deleteDoc, doc } from "firebase/firestore";

import { BsThreeDotsVertical } from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";
import useGoogleTranslate from "../../../constants/helperFunctions";


type ActualPostProps = {
    post: Post,
    setIsUpdating: (arg0: boolean) => void;
}

const ActualPost = (props: ActualPostProps) => {
    const navigate = useNavigate();
    const { users, comments } = useInfo();
    const { currentUser } = useAuth();

    const [showMenu, setShowMenu] = useState(false);
    const postComments = comments?.filter(comment => comment.postID === props.post.id);

    const owner = users && Object.values(users).find(user => user.id === props.post.owner);


    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const deletePost = async (post: Post | undefined) => {
        if (confirm("Are You Sure You Want To Delete This Post")) {
            try {
                if (post?.imageUrl) {
                    const uuid = post?.imageUrl.slice(77, 113);
                    const imageRef = ref(storage, 'posts/' + uuid)
                    deleteObject(imageRef).then(() => { console.log("image deleted") })
                }
                const postRef = doc(collection(db, 'posts'), post?.id)
                await deleteDoc(postRef);
                navigate('/')

            } catch (error) {
                console.log(error)
            }
        }
    }


    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);


    useGoogleTranslate()

    return (
        <div className="flex justify-center min-h-[100vh] pb-5">
            <div className="bg-[#272727] sm:w-[75vw] p-4">

                <div id="google_translate_element"></div>
                <div className="flex items-center justify-between p-4">
                    <NavLink to={`/profile/${owner?.id}`} className="flex items-center gap-3">
                        <img loading="lazy" className="rounded-full aspect-square" src={owner?.avatar} width={35} alt="user avatar" />
                        <p>{owner?.username}</p>
                    </NavLink>
                    {props.post.owner == currentUser?.uid && (
                        <div className="relative" ref={dropdownRef}>
                            <BsThreeDotsVertical className="cursor-pointer" onClick={toggleMenu} />
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                    <button
                                        className="block w-full text-left rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                        onClick={() => { props.setIsUpdating(true); setShowMenu(false) }}
                                    >
                                        Update Post
                                    </button>
                                    <button
                                        className="block w-full text-left rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                        onClick={() => { deletePost(props.post); setShowMenu(false) }}
                                    >
                                        Delete Post
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <p className="text-3xl font-bold">{props.post.title}</p>
                    <br />
                    {props.post && (
                        <div className="text-lg prose dangerous"
                            dangerouslySetInnerHTML={{ __html: props.post.content }}

                        ></div>
                    )}
                </div>

                <div className="flex items-center justify-center mt-4">
                    {
                        props.post.imageUrl?.includes('jpeg') ?
                            <img loading="lazy" src={props.post.imageUrl} width={200} className="rounded-xl w-full" alt={props.post.title} />
                            :
                            <ReactPlayer pip={true} controls={true} url={props.post.imageUrl} />
                    }
                </div>

                <div className="flex items-center gap-7 text-xl p-2">
                    <UpvoteDownvote post={props.post} />

                    <div className="flex items-center gap-1 bg-[#2a3236] px-3  py-1 hover:bg-[#333d42] rounded-full">
                        <GoCommentDiscussion />
                        {postComments?.length}
                    </div>


                    <Share post={props.post} />

                    <Bookmark post={props.post} />
                </div>
                <Comments post={props.post} />



            </div>

        </div>
    )
}

export default ActualPost;