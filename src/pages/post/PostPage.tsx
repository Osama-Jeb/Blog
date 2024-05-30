import { NavLink, useParams } from "react-router-dom";
import { useInfo } from "../../providers/InfoProvider";
import { useAuth } from "../../providers/AuthProvider";
import { Post as PostProps } from "../../constants/types"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firbase";
import { collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import Comments from "../../components/Comments";
import Share from "../../components/Share";

import { BsThreeDotsVertical } from "react-icons/bs";
import UpvoteDownvote from "../../components/UpvoteDownvote";
import { GoCommentDiscussion } from "react-icons/go";
import Bookmark from "../../components/Bookmark";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import Tiptap from "../../components/Tiptap";

import { v4 as uuidv4 } from "uuid"


interface PostActionsProps {
    myPost: PostProps | undefined;
    currentUser: any;
    deletePost: (post: PostProps | undefined) => void;
}

const PostPage = () => {
    const id = useParams();
    const { users, posts, comments } = useInfo();
    const [isUpdating, setIsUpdating] = useState(false);
    const { currentUser } = useAuth();
    const myPost = posts?.filter(post => post.id === id.id)[0];


    const PostActions = ({ myPost, currentUser, deletePost }: PostActionsProps) => {
        const [showMenu, setShowMenu] = useState(false);

        const toggleMenu = () => {
            setShowMenu(!showMenu);
        };

        const handleDelete = () => {
            deletePost(myPost);
            setShowMenu(false); // Close the menu after the action
        };

        const handleUpdate = () => {
            setShowMenu(false); // Close the menu after the action
            setIsUpdating(true)
        };

        return (
            <div className="relative">
                {myPost?.owner == currentUser?.uid && (
                    <div>
                        <BsThreeDotsVertical className="cursor-pointer" onClick={toggleMenu} />
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <button
                                    className="block w-full text-left rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                    onClick={handleUpdate}
                                >
                                    Update Post
                                </button>
                                <button
                                    className="block w-full text-left rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                    onClick={handleDelete}
                                >
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

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

    const [title, setTitle] = useState(myPost?.title);
    const [content, setContent] = useState(myPost?.content);
    const [image, setImage] = useState<any>(myPost?.imageUrl);
    const [loading, setLoading] = useState(false);


    const uploadImage = async (): Promise<string> => {
        if (!image) {
            alert("Add an image!");
            throw new Error("No image provided");
        }
        setLoading(true);
        const imageRef = ref(storage, `posts/${uuidv4()}`);

        try {
            const snapshot = await uploadBytes(imageRef, image);
            const url = await getDownloadURL(snapshot.ref);
            setLoading(false);
            return url;
        } catch (error) {
            console.error(error);
            setLoading(false);
            throw error;
        }
    }

    const updatePost = async (id: string) => {
        let imageUrl = "";

        if (image) {
            try {
                imageUrl = await uploadImage();
            } catch (error) {
                console.error("Image upload failed", error);
                return;
            }
        }
        const newPost = {
            title: title,
            content: content,
            image: imageUrl ?? image,
            updated_at: serverTimestamp(),
        }

        try {
            const postRef = doc(collection(db, "posts"), id)
            updateDoc(postRef, newPost);
            setIsUpdating(false);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {
                myPost ? (
                    isUpdating ?
                        <>
                            <input className=" border-2 border-gray-600 p-2 rounded-xl w-[52%]" placeholder='Title' type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} />

                            <Tiptap content={content ? content : ""} setContent={setContent} />

                            <input className="w-[52%]" type="file" onChange={(e) => { setImage(e.target.files ? e.target.files[0] : null) }} />

                            {
                                image && <img src={image} className="w-[50%] h-[40vh] aspect-square rounded-xl" alt="" />
                            }

                            <button
                                className="bg-green-500 px-4 py-2 rounded"
                                onClick={() => { updatePost(myPost?.id) }}
                            >

                                {
                                    loading ?
                                        <>
                                            <div role="status" className="flex items-center justify-center gap-3">
                                                <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                <p>....Loading</p>
                                            </div>
                                        </>
                                        :
                                        <>
                                            Update Post
                                        </>
                                }
                            </button>
                        </>
                        :
                        <>
                            <div className="flex justify-center min-h-[100vh]">
                                <div className="bg-[#272727] w-[60vw] p-4">
                                    <div className="flex items-center justify-between p-4">
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
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-3xl font-bold">{myPost?.title}</p>
                                        <br />
                                        {myPost?.content && (
                                            <div className="text-lg prose dangerous"
                                                dangerouslySetInnerHTML={{ __html: myPost.content }}

                                            ></div>
                                        )}
                                    </div>
                                    {myPost?.imageUrl && (
                                        <img loading="lazy" src={myPost?.imageUrl} className="rounded-xl w-full h-[350px]" alt={myPost?.title} />
                                    )}
                                    <div className="flex items-center gap-7 text-xl p-2">
                                        <UpvoteDownvote post={myPost} />
                                        <NavLink to={`/post/${myPost?.id}`}>
                                            <div className="flex items-center gap-1 bg-[#2a3236] px-3  py-1 hover:bg-[#333d42] rounded-full">
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
                        </>
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