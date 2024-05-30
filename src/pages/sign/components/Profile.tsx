import { useState } from "react";
import { auth } from "../../../firbase";
import { useInfo } from "../../../providers/InfoProvider";
import Liked from "../../liked/Liked";
import { TbArrowBigUpLineFilled } from "react-icons/tb";
import { FaBookmark, FaCommentAlt } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";
import Post from "../../../components/Post";
import { motion, AnimatePresence } from "framer-motion";
import Comment from "../../../components/Comment";
import { formatDistanceToNow } from "date-fns";

const Profile = () => {
    const { user: userInfo, posts, comments } = useInfo();
    const [selectedCat, setSelectedCat] = useState("posts");

    const myPosts = posts?.filter(post => post.owner == userInfo?.id);
    const upvotedPosts = posts?.filter(post => post.upvotes.includes(userInfo?.id));
    const commented = comments?.filter(comm => comm.owner == userInfo?.id);

    const [isUpdating, setIsUpdating] = useState(false);



    const datestring = userInfo?.created_at.toDate().toString();
    const formatted = userInfo && formatDistanceToNow(new Date(datestring), { addSuffix: true });

    const handleLogout = () => {
        auth.signOut();
    };

    const cats = [
        { name: "posts", icon: <><FaSignsPost /></> },
        { name: "upvotes", icon: <><TbArrowBigUpLineFilled /></> },
        { name: "bookmarks", icon: <><FaBookmark /></> },
        { name: "comments", icon: <><FaCommentAlt /></> },
    ];

    const renderCategoryContent = () => {
        switch (selectedCat) {
            case 'posts':
                return (
                    <div>
                        {myPosts && myPosts.map((post, index) => (
                            <div key={index} className="mb-4">
                                <Post post={post} />
                            </div>
                        ))}
                    </div>
                );
            case 'upvotes':
                return (
                    <div>
                        {upvotedPosts && upvotedPosts.map((post, index) => (
                            <div key={index} className="mb-4">
                                <Post post={post} />
                            </div>
                        ))}
                    </div>
                );
            case 'bookmarks':
                return <div><Liked /></div>;
            case 'comments':
                return (
                    <div>
                        {commented?.map((comm) => (
                            <div className="w-[70vw]">
                                <Comment comment={comm} />
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-[50px]">
            <div>
                {userInfo && (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-4">
                                    <img src={userInfo.avatar} width={50} className="rounded-full aspect-square" alt="" />
                                    <p>{userInfo.username}</p>
                                </div>
                                <p>Member Since: {formatted}</p>
                            </div>
                            <div >
                                <button
                                    onClick={() => { setIsUpdating(!isUpdating) }}
                                    className="bg-green-600 px-4 py-2 rounded-xl text-white font-bold"
                                >
                                    {isUpdating ? "Cancel" : "Update Account"}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 px-4 py-2 ml-4 rounded-xl text-white font-bold"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {
                    isUpdating ?
                        <div className="flex items-center justify-center bg-red-700 min-h[70vh]">
                            <div>
                                
                                <p>testing testing hello </p>
                                <p>testing testing hello </p>
                                <p>testing testing hello </p>
                            </div>
                        </div>
                        :
                        <div className="mt-5">
                            <div className="flex items-center justify-around">
                                {cats.map((category, index) => (
                                    <button className="bg-black text-white text rounded-xl p-4" key={index} onClick={() => { setSelectedCat(category.name); }}>
                                        {category.icon}
                                    </button>
                                ))}
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
                }
            </div>
        </div>
    );
};

export default Profile;
