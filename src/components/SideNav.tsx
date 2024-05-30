import { FaBars, FaPlus, FaRegUserCircle, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHornbill } from "react-icons/fa6";
import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";

const SideNav = () => {

    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [term, setTerm] = useState('');

    const onSearch = () => {
        if (term) {
            navigate('/home', { state: { term } });
        }
    }

    useEffect(() => {
        navigate('/home', { state: { term } });
    }, [term]);

    return (
        <nav className="bg-black text-white flex items-center justify-between py-3 px-6">
            <NavLink className="text-4xl hover:rotate-180" to={"/home"}>
                <FaHornbill />
            </NavLink>

            <div className="hidden md:flex w-[60%]">
                <input
                    type="text"
                    value={term}
                    className="rounded-full w-full text-black pl-4 pr-20 py-2"
                    placeholder="Search"
                    onChange={(e) => { setTerm(e.target.value); }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearch();
                        }
                    }}
                />
            </div>

            <div className="flex items-center gap-4 text-3xl">
                {currentUser && <NavLink to={"/addPost"} className="hover:rotate-180 hover:scale-125 hidden md:block">
                    <FaPlus />
                </NavLink>}
                <NavLink to={"/sign"} className="hidden md:block">
                    <FaRegUserCircle />
                </NavLink>
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

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
                        <NavLink to={"/sign"} className="text-3xl">
                            <FaRegUserCircle />
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>

    )
}

export default SideNav;