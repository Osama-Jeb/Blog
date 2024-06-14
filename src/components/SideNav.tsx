import { useAuth } from "../providers/AuthProvider";
import { useInfo } from "../providers/InfoProvider";
import { useRef, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { FaBars, FaPlus, FaRegUserCircle, FaTimes } from "react-icons/fa";
import { FaHornbill, FaMagnifyingGlass } from "react-icons/fa6";
import { TbZoomReset } from "react-icons/tb";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

import Login from "../pages/sign/components/Login";
import Register from "../pages/sign/components/Register";

import { Modal } from "flowbite-react";

import { auth } from "../firbase";
import { signInWithEmailAndPassword } from "firebase/auth";


const SideNav = () => {
    const { currentUser } = useAuth();
    const { user: userInfo } = useInfo();
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSet, setShowSet] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [term, setTerm] = useState('');

    const settingsRef = useRef<HTMLDivElement>(null);

    const onSearch = () => {
        navigate('/', { state: { term } });
    }

    const onReset = () => {
        setTerm('');
        navigate('/');
    }

    const handleLogout = () => {
        auth.signOut();
        navigate('/')
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
            setShowSet(false);
        }
    };

    useEffect(() => {
        if (showSet) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSet]);


    const signInGuest = async () => {
        const email = "guest@guest.com";
        const password = "password";
        await signInWithEmailAndPassword(auth, email, password)
        setOpenModal(false)
    }

    return (
        <nav className="bg-[#202020] text-[#eef1f3] h-[8vh] flex items-center justify-between py-3 px-6">
            <NavLink className="text-4xl hover:rotate-180" to={"/"}>
                <FaHornbill />
            </NavLink>

            <div className="hidden md:flex items-center gap-2 w-[60%]">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="search" placeholder="Search" required
                        value={term}
                        className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50"
                        onChange={(e) => { setTerm(e.target.value); }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSearch();
                            }
                        }}
                    />
                </div>

                <button className="text-xl" onClick={onSearch}>
                    <FaMagnifyingGlass />
                </button>
                <button className="text-2xl flex items-center" onClick={onReset}>
                    <TbZoomReset />
                </button>
            </div>

            <Modal dismissible className="sm:p-[25vw]" show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Welcome</Modal.Header>
                <Modal.Body>
                    <div className="p-5 sm:p-12 text-black">
                        {
                            isNewUser ?
                                <>
                                    <p className="mb-3 font-bold text-2xl">Sign Up</p>
                                    <Register setOpenModal={setOpenModal} />
                                    <p className="text-center">Already Have an Account ? <button className="underline font-semibold mt-4" onClick={() => { setIsNewUser(false) }}>Sign In</button></p>
                                </>
                                :
                                <>
                                    <p className="mb-3 font-bold text-2xl">Log In</p>
                                    <Login setOpenModal={setOpenModal} />
                                    <p className="text-center">New User ? <button className="underline font-semibold mt-4" onClick={() => { setIsNewUser(true) }}>Create an Account</button></p>
                                </>
                        }

                        <button
                            onClick={signInGuest}
                            className="w-full bg-black text-white px-4 py-2 rounded mt-4">Sign In As Guest</button>
                    </div>
                </Modal.Body>

            </Modal>

            {
                currentUser ?
                    <div className="flex items-center gap-4 text-xl">
                        {currentUser &&
                            <>
                                <NavLink to={"/chat"} className="hidden md:block">
                                    <IoChatbubbleEllipsesOutline />
                                </NavLink>

                                <NavLink to={"/addPost"} className="hidden md:flex items-center gap-3 rounded-full hover:bg-gray-700 px-3 py-2">
                                    <FaPlus />
                                    Create
                                </NavLink>
                            </>

                        }

                        <div className="relative" ref={settingsRef}>
                            <button onClick={() => setShowSet(!showSet)}>
                                {userInfo && <img src={userInfo.avatar} width={30} className="aspect-square rounded-full" alt="user avatar" />}
                            </button>
                            {showSet && (
                                <div className="absolute right-0 mt-2 w-48 p-4 rounded-xl bg-black text-white z-10">
                                    <NavLink onClick={() => { setShowSet(false) }} to={`/profile/${userInfo?.id}`} className="hidden md:flex items-center gap-3">
                                        <FaRegUserCircle />
                                        Profile
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 w-full py-1 mt-3 rounded text-white font-semibold"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>

                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                    :
                    <button
                        onClick={() => { setOpenModal(true) }}
                        className="bg-orange-600 text-white font-semibold px-4 py-2 rounded-full">
                        Log in
                    </button>
            }

            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center space-y-4 py-4 md:hidden">
                    <div className="w-[90%] flex items-center gap-2">
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
                        <button className="text-xl" onClick={() => {
                            onSearch();
                            setMenuOpen(false);
                        }}>
                            <FaMagnifyingGlass />
                        </button>
                        <button className="text-2xl flex items-center" onClick={() => {
                            onReset();
                            setMenuOpen(false);
                        }}>
                            <TbZoomReset />
                        </button>
                    </div>

                    {currentUser &&
                        <div>
                            <NavLink to={"/chat"} className="flex items-center gap-4 rounded-full hover:bg-gray-700 px-4 py-2 font-semibold">
                                <IoChatbubbleEllipsesOutline />
                                Chat
                            </NavLink>
                            <NavLink to={"/addPost"} className="flex items-center gap-4 rounded-full hover:bg-gray-700 px-4 py-2">
                                <FaPlus />
                                Create
                            </NavLink>
                        </div>

                    }
                    <button
                        onClick={() => {
                            handleLogout()
                            setMenuOpen(false)
                        }}
                        className="bg-red-600 py-1 px-4  rounded text-white font-semibold"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </nav>
    );
}

export default SideNav;
