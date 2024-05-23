import { FaHeart, FaHome, FaRegUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";


const SideNav = () => {

    const links = [
        {
            name: "home",
            icon: <FaHome />
        },
        {
            name: "liked",
            icon: <FaHeart />
        },
        {
            name: "sign",
            icon: <FaRegUserCircle />
        }
    ]

    return (
        <nav className="fixed top-0 left-0 flex pt-[4vh] text-3xl gap-4 flex-col items-center h-[100vh] bg-black text-white w-[5vw]">

            {
                links.map((link, index) => (
                    <NavLink
                        key={index}
                        to={`/${link.name}`}
                        className={({ isActive, isPending, isTransitioning }) =>
                            [
                                isPending ? "pending" : "",
                                isActive ? "active" : "",
                                isTransitioning ? "transitioning" : "",
                            ].join(" ")
                        }
                    >
                        {link.icon}
                    </NavLink>
                ))
            }
        </nav>
    )
}

export default SideNav;