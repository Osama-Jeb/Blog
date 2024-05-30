import { FaBars, FaPlus, FaRegUserCircle, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FaGear, FaHornbill } from "react-icons/fa6";
import { useAuth } from "../providers/AuthProvider";
import { useRef, useState } from "react";

import { AnimatedModal, AnimatedModalObject, ModalAnimation } from "@dorbus/react-animated-modal"
import Login from "../pages/sign/components/Login";
import Register from "../pages/sign/components/Register";
import { auth } from "../firbase";

const SideNav = () => {

    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSet, setShowSet] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [term, setTerm] = useState('');
    const ref = useRef<AnimatedModalObject>(null);

    const onSearch = () => {
        if (term) {
            navigate('/', { state: { term } });
        }
    }

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <nav className="bg-black text-white flex items-center justify-between py-3 px-6">

            <NavLink className="text-4xl hover:rotate-180" to={"/"}>
                <FaHornbill />
            </NavLink>

            <div className="hidden md:flex w-[60%]">

                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50" placeholder="Search" required
                        onChange={(e) => { setTerm(e.target.value); }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSearch();
                            }
                        }}
                    />
                </div>
            </div>

            <AnimatedModal
                animation={ModalAnimation.Reveal}
                ref={ref}>
                <div className=" text-black">

                    {
                        isNewUser ?
                            <>
                                <p className="mb-3 font-bold text-2xl">Sign Up</p>
                                <Register />
                                <p>Already Have an Account ? <button className="underline font-semibold mt-4" onClick={() => { setIsNewUser(false) }}>Sign In</button></p>
                            </>
                            :
                            <>
                                <p className="mb-3 font-bold text-2xl">Log In</p>
                                <Login />
                                <p>New User ? <button className="underline font-semibold mt-4" onClick={() => { setIsNewUser(true) }}>Create an Account</button></p>
                            </>
                    }
                </div>
            </AnimatedModal>

            {
                currentUser ?
                    <div className="flex items-center gap-4 text-xl">
                        {currentUser &&

                            <NavLink to={"/addPost"} className="hidden md:flex items-center gap-3 rounded-full hover:bg-gray-900 px-3 py-2">
                                <FaPlus />
                                Create
                            </NavLink>}

                        <div className="relative">
                            <button onClick={() => setShowSet(!showSet)}>
                                <FaRegUserCircle />

                            </button>
                            {
                                showSet ?
                                    <div className="absolute right-0 mt-2 w-48 p-4 rounded-xl bg-black text-white z-10">
                                        <NavLink to={"/profile"} className="hidden md:flex items-center gap-3">
                                            <FaRegUserCircle />
                                            Profile
                                        </NavLink>
                                        <NavLink to={"/settings"} className="hidden md:flex items-center gap-3 my-2">
                                            <FaGear />
                                            Settings
                                        </NavLink>

                                        <button
                                        onClick={handleLogout}
                                        className="bg-red-600 w-full py-1 rounded text-white font-semibold"
                                        >
                                            Log Out
                                        </button>

                                    </div>
                                    :
                                    null
                            }
                        </div>


                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                    :
                    <button
                        onClick={() => { ref.current?.OpenModal() }}
                        className="bg-orange-600 text-white font-semibold px-4 py-2 rounded-full">
                        Log in
                    </button>
            }

            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center space-y-4 py-4 md:hidden">
                    <div className="w-[90%]">
                        <input
                            type="text"
                            value={term}
                            className="rounded-full w-full text-black pl-4 pr-20 py-2"
                            placeholder="Search"
                            onChange={(e) => { setTerm(e.target.value); }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSearch();
                                    setMenuOpen(false);
                                }
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-7">
                        {currentUser && <NavLink to={"/addPost"} className="text-3xl">
                            <FaPlus />
                        </NavLink>}
                        <NavLink to={"/profile"} className="text-3xl">
                            <FaRegUserCircle />
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>

    )
}

export default SideNav;