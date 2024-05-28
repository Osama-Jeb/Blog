import { useInfo } from "../../providers/InfoProvider";
import Post from "../../components/Post";
import { useLocation } from "react-router-dom";

const Home = () => {

    const { posts } = useInfo()

    const sortedPosts = posts?.sort((a, b) => b.created_at - a.created_at);
    const location = useLocation();
    const { term } = location.state || {};

    const searchPosts = posts?.filter(post => post.title.includes(term))

    

    return (
        <>
            <div className="flex flex-col gap-5 items-center my-4 p-4">
                {
                    term ?
                        <>
                            {
                                searchPosts && searchPosts.map((post, index) => (
                                    <div key={index}>
                                        <Post post={post} />
                                    </div>
                                ))
                            }
                        </>
                        :
                        <>
                            {
                                sortedPosts && sortedPosts.map((post, index) => (
                                    <div key={index}>
                                        <Post post={post} />
                                    </div>
                                ))
                            }
                        </>
                }
            </div>
        </>
    )
}

export default Home;