import { useInfo } from "../../providers/InfoProvider";
import Post from "../../components/Post";

const Home = () => {

    const { posts } = useInfo()

    return (
        <>
            <div className="flex flex-col gap-4 items-center mt-4">
                {
                    posts && posts.slice().reverse().map((post, index) => (
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