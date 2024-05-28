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
import { useState } from "react";


interface PostActionsProps {
    myPost: PostProps | undefined;
    currentUser: any;
    deletePost: (post: PostProps | undefined) => void;
    updatePost: (post: PostProps | undefined) => void;
}



const PostActions = ({ myPost, currentUser, deletePost, updatePost }: PostActionsProps) => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleDelete = () => {
        deletePost(myPost);
        setShowMenu(false); // Close the menu after the action
    };

    const handleUpdate = () => {
        updatePost(myPost);
        setShowMenu(false); // Close the menu after the action
    };

    return (
        <div className="relative">
            {myPost?.owner == currentUser?.uid && (
                <div>
                    <BsThreeDotsVertical className="cursor-pointer" onClick={toggleMenu} />
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={handleDelete}
                            >
                                Delete Post
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={handleUpdate}
                            >
                                Update Post
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


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


    const updatePost = () => {
        // TODO: 
    }
    return (
        <>
            {
                myPost ? (
                    <div className="flex items-center justify-center min-h-[75vh] mt-4">
                        <div className="shadow-xl w-[65vw] bg-slate-300 rounded-xl p-3">
                            <div className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-3">
                                    <img loading="lazy" className="rounded-full aspect-square" src={owner?.avatar} width={35} alt="user avatar" />
                                    <p>{owner?.username}</p>
                                    <p>{formatted}</p>
                                </div>
                                <div className="">
                                    <PostActions
                                        myPost={myPost}
                                        currentUser={currentUser}
                                        deletePost={deletePost}
                                        updatePost={updatePost} // Ensure you have this function defined
                                    />
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-3xl font-bold">{myPost?.title}</p>
                                <br />
                                {myPost?.content && (
                                    <p className="text-lg prose-lg" dangerouslySetInnerHTML={{ __html: myPost.content }}></p>
                                )}
                            </div>
                            {myPost?.imageUrl && (
                                <img loading="lazy" src={myPost?.imageUrl} className="rounded-xl w-full h-[350px]" alt={myPost?.title} />
                            )}
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
                    </div>
                ) : (
                    // Loading screen
                    <div className="flex items-center justify-center min-h-[75vh] mt-4">
                        <div className="p-4 bg-gray-200 rounded-md">
                            <p className="text-lg font-semibold">Finding This Post....</p>
                        </div>
                    </div>
                )
            }

        </>
    )
}

export default PostPage;