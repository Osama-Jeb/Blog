import { auth } from "../../../firbase";
import { useAuth } from "../../../providers/AuthProvider";
import { useInfo } from "../../../providers/InfoProvider";

const Profile = () => {
    const { currentUser } = useAuth();
    const { users } = useInfo();
    const userInfo = users && Object.values(users).find(user => user.id === currentUser?.uid);



    const handleLogout = () => {
        auth.signOut()
    }

    return (
        <div>
            <p>{userInfo?.username}</p>
            <button className="bg-red-600 px-4 py-2 rounded text-white font-semibold" onClick={handleLogout}>Sign Out</button>

        </div>
    )
}

export default Profile;