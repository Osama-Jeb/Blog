import { useInfo } from "../../providers/InfoProvider";
import { useLocation } from "react-router-dom";

import Post from "../../components/Post";

const Home = () => {
    const { posts } = useInfo()
    const location = useLocation();
    const { term } = location.state || {};


    const sortedPosts = posts?.sort((a, b) => b.created_at - a.created_at);
    const searchPosts = posts?.filter(post => post.title.includes(term))

    return (
        <div className="flex flex-col gap-5 items-center p-4 min-h-[100vh]">
            <p>Some Sort feature here</p>
            {
                term ?
                    searchPosts && searchPosts.map((post, index) => (
                        <div key={index}>
                            <Post post={post} />
                        </div>
                    ))
                    :

                    sortedPosts && sortedPosts.map((post, index) => (
                        <div key={index}>
                            <Post post={post} />
                        </div>
                    ))

            }
        </div>
    )
}

export default Home;