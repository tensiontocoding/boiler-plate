const express = require('express')
const app = express()
const port = 5001
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/Users");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World! hi hello ')
})

app.post('/api/users/register', (req, res) => {
    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그걸 데이터 베이스에 넣어준다.
    const user = new User(req.body)
    // user.save((err, doc) => {
    //     if (err) return res.json({ success: false, err })
    //     return res.status(200).json({
    //         success: true
    //     })
    // })
    user.save().then(() => {
        res.status(200).json({ success: true })
    }).catch((err) => {
        return res.json({ success: false, err })
    })
})

app.post('/api/users/login', (req, res) => {
    // // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    // User.findOne({ email: req.body.email }, (err, user) => {
    //     if (!user) {
    //         return res.json({
    //             loginSuccess: false,
    //             message: "제공된 이메일에 해당하는 유저가 없습니다."
    //         })
    //     }
    //     //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    //     user.comparePassword(req.body.password, (err, isMatch) => {
    //         if (!isMatch)
    //             return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

    //         //비밀번호 까지 맞다면 토큰을 생성하기.
    //         user.generateToken((err, user) => {
    //             if (err)
    //                 return res.status(400).send(err);

    //             //토큰을 저장한다. 어디에?  쿠키, 로컬스토리지
    //             res.cookie("x_auth", user.token)
    //                 .status(200)
    //                 .json({ loginSuccess: true, userId: user._id })
    //         })
    //     })
    // })

    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.json({
                    loginSuccess: false,
                    message: "제공된 이메일에 해당하는 유저가 없습니다."
                })
            }
            //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch)
                    return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다.", err })

                //비밀번호 까지 맞다면 토큰을 생성하기.
                user.generateToken((err, user) => {
                    if (err)
                        return res.status(400).send(err);

                    //토큰을 저장한다. 어디에?  쿠키, 로컬스토리지
                    res.cookie("x_auth", user.token)
                        .status(200)
                        .json({ loginSuccess: true, userId: user._id })
                })
            })
        }).catch((err) => {
            return res.json({ loginSuccess: false, err })
        })
})

app.get('/api/users/auth', auth, (req, res) => {

    //여기까지 왔다는 것은 Authentication 이 True
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true, //role : 1 어드민, 2 특정부서 어드민 , 0 일반유저( 0아니면 관리자)
        isAuth: true,
        emial: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    // User.findOneAndUpdate({ _id: req.user._id },
    //     { token: "" },
    //     (err, user) => {
    //         if (err) return res.json({ success: false, err });
    //         return res.status(200).send({
    //             success: true
    //         })
    //     })
    User.findByIdAndUpdate({ _id: req.user._id },{ token: "" })
        .then((user) => {

            return res.status(200).send({
                success: true
            })
        })
        .catch((err) => {
            return res.json({ success: false, err });
        })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

