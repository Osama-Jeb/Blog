import { Route, Routes } from "react-router-dom";
import "./App.css"
import SideNav from "./components/SideNav"
import Home from "./pages/home/Home";
import AddPost from "./components/AddPost";
import PostPage from "./pages/post/PostPage";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/sign/components/Profile";

const App = () => {
    return (
        <>
            <SideNav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/addPost" element={<AddPost />} />
                <Route path="/post/:id" element={<PostPage />} />
            </Routes>
        </>
    )
}

export default App;