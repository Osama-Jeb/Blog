import { Route, Routes } from "react-router-dom";
import "./App.css"
import SideNav from "./components/SideNav"
import Home from "./pages/home/Home";
import AddPost from "./components/AddPost";
import PostPage from "./pages/post/PostPage";
import Profile from "./pages/sign/components/Profile";
import { useAuth } from "./providers/AuthProvider";

const App = () => {
    const { isLoading } = useAuth();
    return (
        <>
            {
                isLoading ?
                    <>
                        <SideNav />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/addPost" element={<AddPost />} />
                            <Route path="/post/:id" element={<PostPage />} />
                        </Routes>
                    </>

                    :
                    <div className="flex items-center justify-center h-[100vh]">
                        <p>LOADDIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIING</p>
                    </div>
            }
        </>
    )
}

export default App;