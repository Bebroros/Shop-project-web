const express = require('express');
const server = express();
const fs = require('fs');
const path = require('path');

const port = 8080;

credentials = {user: 'Password1', admin: 'Admin123'};


server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/img', express.static(path.join(__dirname, '/img')));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})


server.get("/", (req, res) => {
    res.sendFile(__dirname + '/registration.html');
})

server.post("/", (req, res) => {
        const {username, password} = req.body;

        if (username in credentials && credentials[username] === password) {
            res.sendFile(__dirname + '/shop.html')
        }
        else {
            res.status(401).send('Not logged in');
        }
})

server.get('/shop', (req, res) => {
    res.sendFile(__dirname + '/shop.html');
})

server.get('/data', async (req, res) => {
    const fileContent = await fs.promises.readFile('./data.json', 'utf8');
    const products = JSON.parse(fileContent);
    res.json(products);
})

server.get('/survey', (req, res) => {
    res.sendFile(__dirname + '/survey.html');
})

server.post('/survey/submit', async (req, res) => {
    const { email, question, topic } = req.body
    if (email && question && topic) {
        const file = await fs.promises.readFile('./survey.json', 'utf8');
        const survey = JSON.parse(file);

        let id = survey ? survey.length : 0;
        survey.push({ "id": id, "Email": email, "Topic": topic, "Question": question, "Time": new Date(Date.now()) });

        await fs.promises.writeFile('./survey.json', JSON.stringify(survey, null, 2));
        res.status(200).send("Successfully saved!");
    }
    else {
        res.status(400).json({ error: 'All fields are required' });
    }
})

