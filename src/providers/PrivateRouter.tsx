// PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { PropsWithChildren } from "react";

const PrivateRoute = ({ children }: PropsWithChildren) => {
    const { currentUser } = useAuth();


    if (currentUser) {
        return children;
    }

    return <Navigate to="/" />;
};



export default PrivateRoute;