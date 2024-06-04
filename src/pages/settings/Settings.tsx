import { formatDistanceToNow } from "date-fns";
import { useInfo } from "../../providers/InfoProvider";
import PrivateRoute from "../../providers/PrivateRouter";

const Settings = () => {
    const { user } = useInfo();

    const datestring = user?.created_at.toDate().toString();
    const formatted = user && formatDistanceToNow(new Date(datestring), { addSuffix: true });

    return (
        <PrivateRoute>
            {
                user && <div className="flex justify-center min-h-[100vh]">
                    <div>
                        <p>settings page</p>
                        <img src={user.avatar} width={100} alt="" />
                        <p>{user.username}</p>
                        <p>{user.email}</p>
                        <p>Member Since: {formatted}</p>

                    </div>

                </div>
            }
        </PrivateRoute>
    )
}

export default Settings;