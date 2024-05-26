import { useInfo } from "../../providers/InfoProvider";
import Post from "../../components/Post";

const Home = () => {

    const { posts } = useInfo()

    const sortedPosts = posts?.sort((a, b) => b.created_at - a.created_at);

    return (
        <>
            <div className="flex flex-col gap-5 items-center mt-4">
                {
                    sortedPosts && sortedPosts.map((post, index) => (
                        <div key={index}>
                            <Post post={post} />
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Home;