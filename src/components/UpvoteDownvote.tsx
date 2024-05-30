import { TbArrowBigDownLineFilled, TbArrowBigUpLineFilled } from "react-icons/tb";
import { Post as PostProps } from "../constants/types"
import { useAuth } from "../providers/AuthProvider";
import { arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firbase";
// import { useNavigate } from "react-router-dom";

type PoP = {
    post: PostProps | undefined
}


const UpvoteDownvote = (props: PoP) => {
    
    const { currentUser } = useAuth();
    const difference = (props.post?.upvotes.length ?? 0) - (props.post?.downvotes.length ?? 0)
    // const navigate = useNavigate();

    const toggleVote = async (voteType: 'upvote' | 'downvote') => {
        if (!currentUser) {
            // navigate('/sign')
            alert('You Need An Account')
        }

        try {
            const postRef = doc(collection(db, 'posts'), props.post?.id);
            const postDoc = await getDoc(postRef);

            if (postDoc.exists()) {
                const postData = postDoc.data();
                const currentUpvotes = postData.upvotes || [];
                const currentDownvotes = postData.downvotes || [];

                const userHasUpvoted = currentUpvotes.includes(currentUser?.uid);
                const userHasDownvoted = currentDownvotes.includes(currentUser?.uid);

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
            } else {
                console.log('Post document not found');
            }

        } catch (error) {
            console.error(`Error updating ${voteType}s: `, error);
        }
    };

    return (
        <>

            <div className="flex items-center justify-between  gap-1 rounded-full bg-[#2a3236]">
                <button onClick={() => { toggleVote('upvote') }}
                    className={`${props.post?.upvotes.includes(currentUser?.uid) ? 'text-red-700' : ''} hover:bg-[#333d42] rounded-full p-2`}
                >
                    <TbArrowBigUpLineFilled />
                </button>

                <span>{difference} </span>

                <button onClick={() => { toggleVote('downvote') }}
                    className={`${props.post?.downvotes.includes(currentUser?.uid) ? 'text-blue-500' : ''} hover:bg-[#333d42] rounded-full p-2`}
                >
                    <TbArrowBigDownLineFilled />
                </button>

            </div>
        </>
    )
}

export default UpvoteDownvote;