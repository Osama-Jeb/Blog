import { Route, Routes } from "react-router-dom";
import "./App.css"
import SideNav from "./components/SideNav"
import Home from "./pages/home/Home";
import Liked from "./pages/liked/Liked";
import Sign from "./pages/sign/Sign";
import AddPost from "./components/AddPost";
import PostPage from "./pages/post/PostPage";
// import UsersNav from "./components/UsersNav";

const App = () => {
    return (
        <>
            <SideNav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/sign" element={<Sign />} />
                <Route path="/liked" element={<Liked />} />
                <Route path="/addPost" element={<AddPost />} />
                <Route path="/post/:id" element={<PostPage />} />
            </Routes>
            {/* <UsersNav /> */}
        </>
    )
}

export default App;