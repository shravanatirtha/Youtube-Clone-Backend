const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let DBURI = `mongodb+srv://dbusr:dbpwd@cluster0.lbqyk.mongodb.net/mySecondDatabase?retryWrites=true&w=majority`
app.use(bodyParser.json());
mongoose.connect(DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, async (err, db) => {
    if (err)
        console.error(err)
});
let connection = mongoose.connection
const User = require('./models/User')

connection.on('connected', async () => {
    console.log("DB Connected")
    // let User = connection.collection("users")
    // let users = await User.find()
    // console.log(users)
    // let users = await User.find({})
    // console.log(users)
    // let newUser = await new User({ username: "Bavya", password: "personal", name: "someone", pwd: "lio" }).save()
    // console.log(newUser)
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
    let user = await User.create({ email: email.toLowerCase(), firstName, lastName, password })
    res.send(user);
})
app.post('/login', async function (req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Required fields are missing." });
    }
    let userExists = await User.findOne({ email: email.toLowerCase() })
    if (userExists) {
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