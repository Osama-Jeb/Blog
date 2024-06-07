import { useInfo } from "../../providers/InfoProvider";
import PrivateRoute from "../../providers/PrivateRouter";

const Settings = () => {
    const { user } = useInfo();


    return (
        <PrivateRoute>
            {
                user && <div className="flex justify-center min-h-[100vh]">
                    <div>
                        <p>settings page</p>
                        <img src={user.avatar} width={100} alt="" />
                        <p>{user.username}</p>
                        <p>{user.email}</p>
                    </div>

                </div>
            }
        </PrivateRoute>
    )
}

export default Settings;