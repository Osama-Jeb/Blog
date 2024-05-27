import { useState } from "react";
import { auth } from "../../../firbase";
import { useAuth } from "../../../providers/AuthProvider";
import { useInfo } from "../../../providers/InfoProvider";
import Liked from "../../liked/Liked";




const Profile = () => {
    const { currentUser } = useAuth();
    const { users } = useInfo();
    const userInfo = users && Object.values(users).find(user => user.id === currentUser?.uid);



    const handleLogout = () => {
        auth.signOut()
    }



    const categs = ["posts", "upvotes", "bookmarks", "comments"]

    const [selectedCat, setSelectedCat] = useState("posts");

    const renderCategoryContent = () => {
        switch (selectedCat) {
            case 'posts':
                return <div>Posts Content</div>;
            case 'upvotes':
                return <div>Upvotes Content</div>;
            case 'bookmarks':
                return <div>
                    <Liked />
                </div>;
            case 'comments':
                return <div>Comments Content</div>;
            default:
                return null;
        }
    };

    return (
        <div className="p-[50px]">

            <div className="">
                {
                    userInfo &&
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-4">
                                    <img src={userInfo.avatar} width={50} className="rounded-full aspect-square" alt="" />
                                    <p>{userInfo.username}</p>
                                </div>
                                <p>account age</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 px-4 py-2 rounded-xl text-white font-bold">
                                Log Out
                            </button>
                        </div>
                    </>
                }

                <div className="mt-5 ">
                    <div className="flex items-center justify-between">
                        {
                            categs.map((element, index) => (
                                <button key={index} onClick={() => { setSelectedCat(element) }} >
                                    <div className="bg-black text-white rounded-xl p-4">
                                        {element}
                                    </div>
                                </button>
                            ))
                        }
                    </div>

                    <div className="flex items-center justify-center mt-4">
                        {renderCategoryContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;