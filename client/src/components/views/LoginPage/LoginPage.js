import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';
import Auth from '../../../hoc/auth';

function LoginPage(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    };
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    };
    const onSubmitHandler = (event) => {
        event.preventDefault(); // submit refresh 방지
        console.log('Email', Email);
        console.log('Password', Password);

        let body = {
            email: Email,
            password: Password
        };

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    navigate("/");
                } else {
                    alert('Error')
                }
            });
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: ' 100vh'
        }}>
            <form action="" style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label htmlFor="">Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label htmlFor="">Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type='submit'>
                    Login
                </button>
            </form>
        </div>
    );
}

export default Auth(LoginPage, false);