import { arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { db } from "../firbase"
import { FaBookmark } from "react-icons/fa"
import { CiBookmarkPlus } from "react-icons/ci"
import { useAuth } from "../providers/AuthProvider"
import {Post as PostProps} from "../constants/types"
import { useInfo } from "../providers/InfoProvider"

type PoP = {
    post: PostProps | undefined
}

const Bookmark = (props : PoP) => {
    const navigate = useNavigate();
    const {user} = useInfo();
    const {currentUser} = useAuth();

    const bookmark = async () => {
        if (!currentUser) {
            navigate('/sign')
        }

        try {
            const userRef = doc(collection(db, 'users'), currentUser?.uid)
            const userDoc = await getDoc(userRef);


            if (userDoc.exists()) {
                const userData = userDoc.data();
                const currentBookmarks = userData.bookmark || [];

                if (currentBookmarks.includes(props.post?.id)) {
                    // remove the post from bookmarks
                    await updateDoc(userRef, {
                        bookmark: arrayRemove(props.post?.id),
                    });
                } else {
                    // add the post to bookmarks
                    await updateDoc(userRef, {
                        bookmark: arrayUnion(props.post?.id),
                    });
                }
            } else {
                console.log('User document not found');
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <button onClick={bookmark} className="bg-[#2a3236] px-4  py-2 hover:bg-[#333d42] rounded-full text-2xl">
                {
                    user?.bookmark.includes(props.post?.id || "") ?
                        <>
                            <FaBookmark />

                        </>
                        :
                        <>
                            <CiBookmarkPlus />
                        </>
                }
            </button>
        </>
    )
}

export default Bookmark;