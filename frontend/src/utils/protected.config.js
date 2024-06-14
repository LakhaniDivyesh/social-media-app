import { Navigate } from "react-router-dom";
// import { verifyToken } from "../services/home.service";

function Protected({ children }) {

    var user = JSON.parse(localStorage.getItem('user') || '[]');


    if (user.length === 0) {
        return <Navigate to={'/login'} replace />
    } else {
        if (user[0].token !== '') {

            return children;
        }
        else {
            return <Navigate to={'/login'} replace />
        }
    }

    // verifyToken(token).then((r)=> {
    //     if(r.code === '1'){
    //         localStorage.setItem('user', JSON.stringify([{"name":r.data[0].name}]));
    //     }else{
    //         return <Navigate to={"/login"} replace />;

    //     }
    // });

}

export default Protected;
