import { useState } from "react";
import { useInfo } from "../../../providers/InfoProvider";
import Liked from "../../liked/Liked";
import { TbArrowBigUpLineFilled } from "react-icons/tb";
import { FaBookmark, FaCommentAlt } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";
import Post from "../../../components/Post";
import { motion, AnimatePresence } from "framer-motion";
import Comment from "../../../components/Comment";
import PrivateRoute from "../../../providers/PrivateRouter";

const Profile = () => {
    const { user: userInfo, posts, comments } = useInfo();
    const [selectedCat, setSelectedCat] = useState("Posts");

    const myPosts = posts?.filter(post => post.owner == userInfo?.id);
    const upvotedPosts = posts?.filter(post => post.upvotes.includes(userInfo?.id));
    const commented = comments?.filter(comm => comm.owner == userInfo?.id);


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
                                <div key={index} className="mb-4">
                                    <Post post={post} />
                                </div>
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
                                <div key={index} className="mb-4">
                                    <Post post={post} />
                                </div>
                            ))
                            :
                            <p className="text-4xl font-semibold mt-4">You Have No Upvotes Yet</p>
                        }
                    </div>
                );

            case 'Bookmarks':
                return <div><Liked /></div>;

            case 'Comments':
                return (
                    <div>
                        {
                            comments && comments.length > 0 ?
                                commented?.map((comm) => (
                                    <div className="w-[70vw]">
                                        <p>From Post: <span className="font-semibold text-xl">{posts?.filter(post => post.id === comm.postID)[0].title}</span></p>
                                        <Comment comment={comm} />
                                    </div>
                                ))
                                :
                                <p className="text-4xl font-semibold mt-4">You Have No Comments Yet</p>
                        }
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <PrivateRoute>
            <div className="p-[50px] min-h-[100vh]">
                <div>

                    <div className="mt-5">
                        <div className="flex items-center justify-around">
                            <div className="flex items-center justify-around w-[50%]">
                                {cats.map((category, index) => (
                                    <button className="bg-black text-white text rounded-xl p-4" key={index} onClick={() => { setSelectedCat(category.name); }}>
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
