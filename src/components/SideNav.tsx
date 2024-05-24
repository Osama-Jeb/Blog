import { FaHome, FaRegUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { CiBookmarkPlus } from "react-icons/ci";


const SideNav = () => {

    const links = [
        {
            name: "Create",
            link: "addPost",
            icon: <FaPlus />
        },
        {
            name: "Home",
            link: "home",
            icon: <FaHome />
        },
        {
            name: "Saved",
            link: "liked",
            icon: <CiBookmarkPlus />
        },
        {
            name: "Profile",
            link: "sign",
            icon: <FaRegUserCircle />
        },
    ]

    return (
        <nav className="fixed top-0 left-0 flex pt-[4vh] text-3xl gap-4 flex-col h-[100vh] bg-black text-white w-[5vw] hover:w-[10vw]">

            {
                links.map((link, index) => (
                    <NavLink
                        key={index}
                        to={`/${link.link}`}
                        className={({ isActive, isPending, isTransitioning }) =>
                            [
                                isPending ? "pending" : "",
                                isActive ? "bg-blue-700" : "",
                                isTransitioning ? "transitioning" : "",
                            ].join(" ")
                            + "p-4"}
                    >
                        <div className="flex items-center gap-3">
                            <p>{link.icon}</p>
                            <p className="navItem text-lg">{link.name}</p>
                        </div>
                    </NavLink>
                ))
            }
        </nav>
    )
}

export default SideNav;