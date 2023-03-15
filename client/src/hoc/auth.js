import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from '../_actions/user_action';
import { useNavigate } from "react-router-dom";

const Auth = (SpecificComponent, option, adminRoute = null) => {

    //null 아무나 출입 가능
    //true 로그인한 유저만 출입가능
    //false 로그인한 유저는 출입불가

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            dispatch(auth())
                .then(response => {
                    console.log(response);
                    if (!response.payload.isAuth) {
                        //로그인 하지 않은 상태
                        if (option) {
                            navigate("/login");
                        }
                    } else {
                        //로그인한 상태
                        if (adminRoute && !response.payload.isAdmin) {
                            navigate("/");
                        } else {
                            if (option === false)
                                navigate("/");
                        }
                    }
                })
        })

        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck;
}
export default Auth;