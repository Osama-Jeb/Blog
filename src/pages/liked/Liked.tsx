import { useInfo } from "../../providers/InfoProvider";

import Post from "../../components/Post";

const Liked = () => {
    const { user, posts } = useInfo();

    const bookmarkedPosts = posts?.filter(post => user?.bookmark.includes(post.id))
    return (
        <>
            {
                bookmarkedPosts && bookmarkedPosts.length > 0 ?
                    bookmarkedPosts?.map((post, index) => (
                        <div key={index} className="mt-5">
                            <Post post={post} />
                        </div>
                    ))
                    :
                    <p className="text-4xl font-semibold mt-4">You Have No Bookmarks Yet</p>

            }
        </>
    )
}

export default Liked;