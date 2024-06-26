import { useState } from "react";
import { useInfo } from "../../../providers/InfoProvider";

import { TbArrowBigUpLineFilled } from "react-icons/tb";
import { FaBookmark, FaCommentAlt } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";

import { motion, AnimatePresence } from "framer-motion";
import Comment from "../../../components/Comment";
import PrivateRoute from "../../../providers/PrivateRouter";
import { collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firbase";
import { FaPen } from "react-icons/fa6";
import { StorageReference, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { v4 as uuidv4 } from "uuid"
import { NavLink, useParams } from "react-router-dom";
import { Post as PostProp } from "../../../constants/types";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

type CompProp = {
    post: PostProp;
    index: number;
}

const ComporessedPost = (props: CompProp) => {
    const regex = /(<([^>]+)>)/gi;

    return (
        <NavLink to={`/post/${props.post.id}`} key={props.index} className="my-4 flex items-center gap-4 w-[60vw] p-3 hover:bg-[#181c1f] rounded-xl">
            {
                props.post.imageUrl?.includes('jpeg') ?
                    <img loading="lazy" src={props.post.imageUrl} className="w-[250px] h-[250px] aspect-square rounded-xl" alt={props.post.title} />
                    :
                    <ReactPlayer pip={true} controls={true} width={250} url={props.post.imageUrl} />

            }
            <div className="flex flex-col gap-3">
                <p className="font-bold text-2xl">{props.post.title}</p>
                <p>{props.post.content.replace(regex, "")}</p>
            </div>
        </NavLink>
    )
}


const Profile = () => {


    const { user: userInfo, posts, comments, users } = useInfo();
    const id = useParams();
    const profileOwner = users && Object.values(users).find(user => user.id === id.id);

    const [selectedCat, setSelectedCat] = useState("Posts");

    const myPosts = posts?.filter(post => post.owner == profileOwner?.id);
    const upvotedPosts = posts?.filter(post => post.upvotes.includes(profileOwner?.id ?? ''));
    const commented = comments?.filter(comm => comm.owner == profileOwner?.id);
    const bookmarkedPosts = posts?.filter(post => userInfo?.bookmark.includes(post.id))



    const cats = [
        { name: "Posts", icon: <><FaSignsPost /></> },
        { name: "Upvotes", icon: <><TbArrowBigUpLineFilled /></> },
        { name: "Bookmarks", icon: <><FaBookmark /></> },
        { name: "Comments", icon: <><FaCommentAlt /></> },
    ];


    const renderCategoryContent = () => {
        switch (selectedCat) {
            case 'Posts':
                return (
                    <div>
                        {myPosts && myPosts.length > 0 ?
                            myPosts.sort((a, b) => b.created_at - a.created_at).map((post, index) => (

                                <ComporessedPost post={post} index={index} />

                            ))
                            :
                            <p className="text-4xl font-semibold mt-4">You Have No Posts Yet</p>

                        }
                    </div>
                );

            case 'Upvotes':
                return (
                    <div>
                        {upvotedPosts && upvotedPosts.length > 0 ?

                            upvotedPosts.sort((a, b) => b.created_at - a.created_at).map((post, index) => (
                                <ComporessedPost post={post} index={index} />

                            ))
                            :
                            <p className="text-4xl font-semibold mt-4">You Have No Upvotes Yet</p>
                        }
                    </div>
                );

            case 'Bookmarks':
                return <div>

                    {
                        bookmarkedPosts && bookmarkedPosts.length > 0 ?
                            bookmarkedPosts?.map((post, index) => (
                                <ComporessedPost post={post} index={index} />

                            ))
                            :
                            <p className="text-4xl font-semibold mt-4">You Have No Bookmarks Yet</p>

                    }
                </div>;

            case 'Comments':
                return (
                    <>
                        {
                            comments && comments.length > 0 ?
                                commented?.map((comm) => (
                                    <div className="sm:w-[70vw] mt-5 hover:bg-[#181c1f] rounded">
                                        <NavLink to={`/post/${posts?.filter(post => post.id === comm.postID)[0]?.id}`}
                                            className="bg-black text-white rounded px-3 py-2"
                                        >
                                            Original Post: <span className="font-semibold text-xl">{posts?.filter(post => post.id === comm.postID)[0]?.title}</span>
                                        </NavLink>
                                        <Comment comment={comm} />
                                        <hr />
                                    </div>
                                ))
                                :
                                <p className="text-4xl font-semibold mt-4">You Have No Comments Yet</p>
                        }
                    </>
                );
            default:
                return null;
        }
    };



    const [isUpdating, setIsUpdating] = useState(false);
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [updateImage, setUpdateImage] = useState<any>(null)
    const [updateUsername, setUpdatedUsername] = useState(profileOwner?.username);
    const [loading, setLoading] = useState(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file (PNG or JPEG/JPG).');
                return;
            }

            // file size
            const maxSizeInBytes = 2 * 1024 * 1024; // 2 megabytes
            if (file.size > maxSizeInBytes) {
                alert('Please select a file smaller than 2 megabytes.');
                return;
            }

            setImagePreview(URL.createObjectURL(file));
            setUpdateImage(file)
        }
    };
    const uploadFile = async (): Promise<string> => {
        if (updateImage) {

            let imageRef: StorageReference;
            imageRef = ref(storage, `avatars/${uuidv4()}`);
            try {
                const snapshot = await uploadBytes(imageRef, updateImage);
                const url = await getDownloadURL(snapshot.ref);
                return url;
            } catch (error) {
                console.error(error);
                throw error;
            }
        } else {
            return ""
        }
    }

    const updateUser = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        if (!updateUsername) {
            alert('Please Write a Username');
            return
        }

        let newImg = "";

        if (updateImage) {
            try {
                newImg = await uploadFile();
            } catch (error) {
                console.error("Image upload failed", error);
                return;
            }
        }


        const newInfo = {
            username: updateUsername,
            avatar: newImg || profileOwner?.avatar,
            updated_at: serverTimestamp()
        }

        try {
            const userRef = doc(collection(db, 'users'), profileOwner?.id)
            updateDoc(userRef, newInfo)
            setIsUpdating(false)
            setLoading(false)

            toast.success('Profile Updated');
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <PrivateRoute>
            <div className="sm:p-[50px] min-h-[100vh]">
                <div>
                    <div className="sm:w-[70%] mx-auto flex justify-between items-center gap-3 p-2">
                        {
                            isUpdating ?
                                <form className="flex items-center gap-3">
                                    {/* updating info */}
                                    <label htmlFor="file-input" className="flex items-center justify-center w-12 text-2xl font-bold h-12 bg-black text-white rounded-full cursor-pointer">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Selected" className="w-12 h-12 rounded-full aspect-square" />
                                        ) : (
                                            '+'
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        id="file-input"
                                        className="hidden"
                                        accept="image/png, image/jpeg"
                                        onChange={handleImageChange}
                                    />

                                    <input type="text"
                                        className="text-black rounded"
                                        value={updateUsername}
                                        onChange={(e) => { setUpdatedUsername(e.target.value) }}
                                    />
                                    <button
                                        className="px-4 py-2 bg-green-500 rounded font-semibold"
                                        onClick={updateUser}
                                        disabled={loading}
                                    >
                                        update
                                    </button>
                                </form>
                                :
                                <div className="flex items-center gap-3">
                                    {/* info */}
                                    <img className="rounded-full w-12 h-12" src={profileOwner?.avatar} alt="profileOwner avatar" />
                                    <p className="text-xl">{profileOwner?.username}</p>
                                </div>
                        }

                        {
                            userInfo?.id === profileOwner?.id ?
                                <button
                                    onClick={() => { setIsUpdating(!isUpdating) }}
                                    className="bg-black text-white p-2 rounded"
                                >
                                    <FaPen />
                                </button>
                                :
                                null
                        }
                    </div>
                    <div className="mt-5">
                        <div className="flex items-center justify-around">
                            <div className="flex items-center justify-around gap-4 sm:w-[50%]">
                                {cats.map((category, index) => (
                                    <button className="bg-black text-white text rounded-xl sm:p-4 p-2" key={index} onClick={() => { setSelectedCat(category.name); }}>
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-center mt-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedCat}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {renderCategoryContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default Profile;
