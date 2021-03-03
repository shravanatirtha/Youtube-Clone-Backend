const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const cors = require('cors');
let DBURI = `mongodb+srv://dbusr:dbpwd@cluster0.lbqyk.mongodb.net/mySecondDatabase?retryWrites=true&w=majority`
app.use(bodyParser.json());
app.use(cors())
app.set('view engine', 'ejs');

mongoose.connect(DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, async (err, db) => {
    if (err)
        console.error(err)
});

const API_KEY = "AIzaSyBBBMxyRen33kyBrXZVBM2UE49E8cgrwSg"
let connection = mongoose.connection;
const User = require('./models/User')

connection.on('connected', async () => {
    console.log("DB Connected")
    // console.log(await User.find({}))
    // let User = connection.collection("users")
    // let users = await User.findOne({})
    // console.log(users)
    // let newUser = await User.insert({ name: "baskar", description: "Something" })
    // console.log(newUser)
    // let newUsers = await User.insertMany([{ name: "Bob Hary", description: "Something" }, { fullName: "Bob Hary" }, { firstName: "Bob", lastName: "Hary" }])
    // console.log(newUsers)
    // let users = await User.find({})
    // console.log(users)
    // let newUser = await new User({ username: "Bavya", password: "personal", name: "someone", pwd: "lio" }).save()
    // console.log(newUser)
})

app.get("/viewengine", function (req, res) {
    res.render("index", { title: "Baskaryabase", body: "this the description" })
})

app.get("/videos", async function (req, res) {
    try {
        let { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=jesus&part=snippet`)
        return res.send(data);
    } catch (err) {
        console.log(err)
    }
})

app.get("/search/:keyword", async function (req, res) {
    try {
        let { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${req.params.keyword}&part=snippet`)
        return res.send(data);
    } catch (err) {
        console.log(err)
    }
})

app.post('/signup', async function (req, res) {
    const { email, firstName, lastName, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Required fields are missing." });
    }
    if (email) {
        let userExists = await User.findOne({ email: email.toLowerCase() })
        if (userExists) return res.status(400).send({ message: "User already exists." });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let user = await User.create({ email: email.toLowerCase(), firstName, lastName, password: hash })
    res.send(user);
})
app.post('/login', async function (req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Required fields are missing." });
    }

    let userExists = await User.findOne({ email: email.toLowerCase() })
    let isMatch = bcrypt.compareSync(password, userExists.password); // true

    if (userExists && isMatch) {
        res.status(200).send(userExists)
    }
    return res.status(401).send({ message: "Invalid username/password" })
})

app.post('/:param', function (req, res) {
    res.json({ body: req.body, param: req.params, query: req.query });
})
app.get('/', function (req, res) {
    res.json({ data: "" })
})

app.listen(5000, () => {
    console.log("listening pon port http://localhost:5000")
})