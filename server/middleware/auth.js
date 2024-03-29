const { User } = require("../models/Users");

let auth = (req, res, next) => {
    //인증처리 하는 곳

    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    //토큰 복호화 후 유저 찾기
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next(); //middelware 이후에도 진행하도록 
    })
    //유저가 있으면 인증 ok, 유저가 없으면 인증 no
}

module.exports = { auth };