import { useAuth } from "../providers/AuthProvider";
import { Post as PostProps } from "../constants/types"

import { TbArrowBigDownLineFilled, TbArrowBigUpLineFilled } from "react-icons/tb";

import { arrayRemove, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firbase";

type PoP = {
    post: PostProps | undefined
}
const UpvoteDownvote = (props: PoP) => {
    const { currentUser } = useAuth();
    const voteCount = props.post && (props.post.upvotes.length - props.post.downvotes.length)
    const currentUpvotes = props.post?.upvotes || [];
    const currentDownvotes = props.post?.downvotes || [];

    const userHasUpvoted = currentUpvotes.includes(currentUser?.uid);
    const userHasDownvoted = currentDownvotes.includes(currentUser?.uid);

    const toggleVote = async (voteType: 'upvote' | 'downvote') => {
        if (!currentUser) {
            alert('You Need An Account')
        }

        try {
            const postRef = doc(collection(db, 'posts'), props.post?.id);
            
            if (voteType === 'upvote') {
                if (userHasUpvoted) {
                    // Remove the upvote
                    await updateDoc(postRef, {
                        upvotes: arrayRemove(currentUser?.uid),
                    });
                } else {
                    // Add the upvote and remove downvote if present
                    const updateData: any = {
                        upvotes: arrayUnion(currentUser?.uid),
                    };
                    if (userHasDownvoted) {
                        updateData.downvotes = arrayRemove(currentUser?.uid);
                    }
                    await updateDoc(postRef, updateData);
                }
            } else if (voteType === 'downvote') {
                if (userHasDownvoted) {
                    // Remove the downvote
                    await updateDoc(postRef, {
                        downvotes: arrayRemove(currentUser?.uid),
                    });
                } else {
                    // Add the downvote and remove upvote if present
                    const updateData: any = {
                        downvotes: arrayUnion(currentUser?.uid),
                    };
                    if (userHasUpvoted) {
                        updateData.upvotes = arrayRemove(currentUser?.uid);
                    }
                    await updateDoc(postRef, updateData);
                }
            }

        } catch (error) {
            console.error(`Error updating ${voteType}s: `, error);
        }
    };

    return (
        <>

            <div className="flex items-center justify-between  gap-1 rounded-full bg-[#2a3236]">
                <button onClick={() => { toggleVote('upvote') }}
                    className={`${userHasUpvoted ? 'text-orange-600' : ''} hover:bg-[#333d42] rounded-full p-2`}
                >
                    <TbArrowBigUpLineFilled />
                </button>

                <span>{voteCount}</span>

                <button onClick={() => { toggleVote('downvote') }}
                    className={`${userHasDownvoted ? 'text-blue-600' : ''} hover:bg-[#333d42] rounded-full p-2`}
                >
                    <TbArrowBigDownLineFilled />
                </button>
            </div>
        </>
    )
}

export default UpvoteDownvote;