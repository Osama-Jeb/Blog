import { useInfo } from "../../providers/InfoProvider";
import Post from "../../components/Post";
import AddPost from "../../components/AddPost";

const Home = () => {

    const { posts } = useInfo()





    return (
        <>
            <AddPost />
            <div className="flex flex-col gap-4 items-center">
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