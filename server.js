// server.js
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const dataFilePath = './data/users.json'

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
// ...

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.get('/forgotPassword', (req, res) => {
    res.sendFile(__dirname + '/public/forgotpassword.html')
})

app.get('/changePassword', (req, res) => {
    res.sendFile(__dirname + '/public/changepassword.html')
})

app.get('/products', (req,res) => {
    res.sendFile(__dirname + '/public/products.html')
})


// Handle form submission
app.post('/addUser', (req, res) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        username: req.body.username,
        password: req.body.password,
        answer: req.body.answer
    };

    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    const userData = JSON.parse(rawData);
    userData.push(newUser);
    fs.writeFileSync(dataFilePath, JSON.stringify(userData, null, 2));
    res.redirect('/login')
});

app.post('/loginUser', (req, res) => {
    const rawData = fs.readFileSync(dataFilePath, 'utf-8')
    const userData = JSON.parse(rawData)
    let loginUsername = req.body.username
    let loginPassword = req.body.password
    let login = false
    for (let i = 0; i < userData.length; i++) {
        if (userData[i].username == loginUsername && userData[i].password == loginPassword) {
            login = true
        } else {
            login = false
        }
    }
    if (login == true) {
        res.redirect('/products')
    } else {
        res.send(`login failed. <a href='/login'>Try again</a>`)
    }
})

app.post('/forgot', (req, res) => {
    const rawData = fs.readFileSync(dataFilePath, 'utf-8')
    const userData = JSON.parse(rawData)
    let forgotUsername = req.body.forgotUsername
    let securityAnswer = req.body.securityAnswer
    let newPassword = req.body.newPassword
    let userid = null
    let i = -1
    
    for(let k = 0; k < userData.length; k++){
        if(forgotUsername == userData[k].username && securityAnswer == userData[k].answer){
            i = k
        }
    }
    if(i !== -1){
        userData[i].password = newPassword
        const updatedPassword = JSON.stringify(userData, null, 2)
        fs.writeFileSync(dataFilePath, updatedPassword, 'utf-8')
        res.send(`<p>Password Changed Successfully <a href='/login'>Go to Login</a>`)
    } else {
        res.send(`Invalid Credentials <a href = '/forgotPassword'>Try Again</a>`)
    }
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

