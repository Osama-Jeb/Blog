import Post from "../../components/Post";
import { useInfo } from "../../providers/InfoProvider";

const Liked = () => {
    const { user, posts } = useInfo();
    

    
    const bookmarkedPosts = posts?.filter(post => user?.bookmark.includes(post.id))
    return (
        <>
            {
                bookmarkedPosts && bookmarkedPosts?.map((post, index) => (
                    <div key={index} className="mt-5">
                        <Post post={post} />
                    </div>
                ))
            }
        </>
    )
}

export default Liked;