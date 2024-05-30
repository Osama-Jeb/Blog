import { CiShare2 } from "react-icons/ci";
import { FacebookIcon, FacebookShareButton, RedditIcon, RedditShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { Post as PostProps } from "../constants/types"
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";

type PoP = {
    post: PostProps | undefined
}

const Share = (props: PoP) => {

    const postUrl = `https://myblogproject.vercel.app/post/${props.post?.id}`;
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    const shareButtons = [
        {
            component: FacebookShareButton,
            icon: FacebookIcon,
        },
        {
            component: RedditShareButton,
            icon: RedditIcon,
        },
        {
            component: TwitterShareButton,
            icon: TwitterIcon,
        },
        {
            component: WhatsappShareButton,
            icon: WhatsappIcon,
        },
    ];

    return (
        <>

            <div className="relative">
                <button className="bg-[#2a3236] px-4  py-2 hover:bg-[#333d42] rounded-full text-2xl" onClick={toggleDropdown}>
                    <CiShare2 />
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 flex items-center justify-around p-4 gap-3 bg-white text-[#0e1113] rounded-md shadow-lg z-10">
                        <button className="text-2xl" onClick={() => { 
                            navigator.clipboard.writeText("https://myblogproject.vercel.app/post/" + props.post?.id)
                            setShowDropdown(false)
                            }}>
                            <FaRegCopy />
                        </button>

                        {shareButtons.map(({ component: ShareComponent, icon: IconComponent }, index) => (
                            <ShareComponent key={index} url={postUrl}>
                                <IconComponent size={32} round />
                            </ShareComponent>
                        ))}
                    </div>
                )}
            </div>

        </>
    )
}

export default Share;