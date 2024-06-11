import { useState } from "react";
import { useParams } from "react-router-dom";
import { useInfo } from "../../providers/InfoProvider";

import UpdatePost from "./components/UpdatePost";
import ActualPost from "./components/ActualPost";


const PostPage = () => {
    const id = useParams();
    const { posts } = useInfo();
    const [isUpdating, setIsUpdating] = useState(false);

    const myPost = posts?.filter(post => post.id === id.id)[0];


    return (
        <>
            {
                myPost ? (
                    isUpdating ?
                        <UpdatePost setIsUpdating={setIsUpdating} post={myPost} />
                        :
                        <ActualPost setIsUpdating={setIsUpdating} post={myPost} />
                ) : (
                    // Loading screen
                    <div className="flex items-center justify-center min-h-[100vh] mt-4">
                        <div className="p-4 bg-gray-200 text-black rounded-md">
                            <p className="text-lg font-semibold">Finding This Post....</p>
                        </div>
                    </div>
                )
            }

        </>
    )
}

export default PostPage;