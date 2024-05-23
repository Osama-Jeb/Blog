import { Route, Routes } from "react-router-dom";
import "./App.css"
import SideNav from "./components/SideNav"
import Home from "./pages/home/Home";
import Liked from "./pages/liked/Liked";
import Sign from "./pages/sign/Sign";

const App = () => {
    return (
        <>
            <SideNav />
            <div className="flex flex-col items-center gap-3">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/sign" element={<Sign />} />
                    <Route path="/liked" element={<Liked />} />
                </Routes>
            </div>
        </>
    )
}

export default App;