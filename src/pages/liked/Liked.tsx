import Post from "../../components/Post";
import { useAuth } from "../../providers/AuthProvider";
import { useInfo } from "../../providers/InfoProvider";

const Liked = () => {
    const { users, posts } = useInfo();
    const { currentUser } = useAuth();
    
    const user = users && Object.values(users).find(element => element.id === currentUser?.uid);
    
    const bookmarkedPosts = posts?.filter(post => user?.bookmark.includes(post.id))
    return (
        <>
            {
                bookmarkedPosts && bookmarkedPosts?.map((post, index) => (
                    <>
                        <Post post={post} />
                    </>
                ))
            }
        </>
    )
}

export default Liked;