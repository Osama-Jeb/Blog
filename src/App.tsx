import { Route, Routes } from "react-router-dom";
import "./App.css"
import SideNav from "./components/SideNav"
import Home from "./pages/home/Home";
import AddPost from "./components/AddPost";
import PostPage from "./pages/post/PostPage";
import Profile from "./pages/sign/components/Profile";
import { useAuth } from "./providers/AuthProvider";
import Chat from "./pages/chat/Chat";
import Notification from "./components/Notification";

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
                            <Route path="/chat" element={<Chat />} />
                        </Routes>
                    </>

                    :
                    <div className="flex items-center justify-center h-[100vh]">
                        <p>LOADDIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIING</p>
                    </div>
            }

            <Notification />
        </>
    )
}

export default App;