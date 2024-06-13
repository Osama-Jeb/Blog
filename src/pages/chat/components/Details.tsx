import { useInfo } from "../../../providers/InfoProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";

const Details = () => {
    const { user } = useInfo()
    return (
        <div className="flex-1 details">
            <div className="user px-8 py-5 flex flex-col items-center gap-5 border-b-2 border-[#dddddd35]">
                <img src={user?.avatar} className="w-[120px] h-[120px] rounded-full aspect-square object-cover" alt="" />
                <p>users name</p>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>

            {/* info */}
            <div className="info p-5 flex flex-col gap-7">
                <div className="option">
                    <div className="title flex items-center justify-between">
                        <span>Chat Settings</span>
                        <IoIosArrowUp />
                    </div>
                </div>

                <div className="option">
                    <div className="title flex items-center justify-between">
                        <span>Chat Settings</span>
                        <IoIosArrowDown />
                    </div>


                </div>

                <div className="option">
                    <div className="title flex items-center justify-between">
                        <span>Privacy and Help</span>
                        <IoIosArrowUp />
                    </div>
                </div>

                <div className="option">
                    <div className="title flex items-center justify-between">
                        <span>Shared Photos</span>
                        <IoIosArrowDown />
                    </div>

                    <div className="photos flex flex-col gap-5 mt-4">
                        <div className="photoItem flex items-center justify-between px-4">
                            <div className="photoDetails flex items-center gap-5">

                                <img src={user?.avatar} className="w-[40px] h-[40px] object-cover rounded" alt="" />
                                <span className="text-gray-400">image name</span>
                            </div>

                            <button className="text-2xl">
                                <IoMdDownload />
                            </button>
                        </div>
                    </div>
                </div>


                <div className="option">
                    <div className="title flex items-center justify-between">
                        <span>Shared Files</span>
                        <IoIosArrowUp />
                    </div>
                </div>

                <button className="px-5 py-2 bg-red-700/45 hover:bg-red-700 text-white font-semibold rounded">Block User</button>
            </div>
        </div>
    )
}

export default Details;