import { CiShare2 } from "react-icons/ci";
import { FacebookIcon, FacebookShareButton, RedditIcon, RedditShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { Post as PostProps } from "../constants/types"
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { Modal } from "flowbite-react";

type PoP = {
    post: PostProps | undefined
}

//!! TODO: MAP OVER THE LINKS

const Share = (props: PoP) => {

    const [openModal, setOpenModal] = useState(false);
    const postUrl = `https://myblogproject.vercel.app/post/${props.post?.id}`;

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


            <button onClick={() => { setOpenModal(true) }}>
                <CiShare2 />
            </button>

            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header className="p-2">Share This Post : {props.post?.title}</Modal.Header>

                <Modal.Body>
                    <div className="p-3 flex items-center justify-around gap-4 flex-wrap">

                        <button className="text-2xl" onClick={() => { navigator.clipboard.writeText("https://myblogproject.vercel.app/post/" + props.post?.id) }}>
                            <FaRegCopy />
                        </button>

                        {shareButtons.map(({ component: ShareComponent, icon: IconComponent }, index) => (
                            <ShareComponent key={index} url={postUrl}>
                                <IconComponent size={32} round />
                            </ShareComponent>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Share;