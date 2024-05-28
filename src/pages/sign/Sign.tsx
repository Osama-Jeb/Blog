import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";

const Sign = () => {
    const { currentUser } = useAuth();
    const [isNewUser, setIsNewUser] = useState(false);

    const renderAuthForm = () => {
        if (isNewUser) {
            return (
                <div className="h-[75vh] flex items-center justify-center flex-col">
                    <Register />
                    <p className="mt-5">
                        Already Have an Account?{" "}
                        <button className="underline font-semibold cursor-pointer" onClick={() => setIsNewUser(false)}>
                            Sign In
                        </button>
                    </p>
                </div>
            );
        } else {
            return (
                <div className="h-[75vh] flex items-center justify-center flex-col">
                    <Login />
                    <p className="mt-5">
                        Create New Account?{" "}
                        <button className="underline font-semibold cursor-pointer" onClick={() => setIsNewUser(true)}>
                            Register
                        </button>
                    </p>
                </div>
            );
        }
    };

    return (
        <div>
            {currentUser ? <Profile /> : renderAuthForm()}
        </div>
    );
};

export default Sign;
