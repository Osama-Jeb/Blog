import { FaPlus, FaRegUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const SideNav = () => {

    const navigate = useNavigate();

    const onSearch = () => {
        //TODO send the variable to this page then filter the posts
        navigate('/home')
    }

    return (
        // <nav className="fixed top-0 left-0 flex text-[4vh] pt-4 gap-4 flex-col h-[7vh] hover:h-[100vh] bg-black text-white w-[5vw] hover:w-[10vw] group">
        <nav className="bg-black text-white flex items-center justify-between py-3 px-6">

            <NavLink to={"/home"}>Logo</NavLink>

            <input type="text" className="rounded-full w-[60%]" placeholder="Search" onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onSearch();
                }
            }} />

            <div className="flex items-center gap-4 text-3xl">
                <NavLink to={"/addPost"} className="hover:rotate-180 hover:scale-125">
                    <FaPlus />
                </NavLink>
                <NavLink to={"/sign"}>
                    <FaRegUserCircle />
                </NavLink>
            </div>

        </nav>

    )
}

export default SideNav;