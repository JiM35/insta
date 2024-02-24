const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 3000
app.use(bodyParser.urlencoded({extended: false}));
app.set( 'view engine', 'ejs' ); // set up ejs for templating

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/download', async (req, res) => {
    const url = req.body.url

    if (!url || !url.startsWith("https://www.instagram.com/")) {
        res.render("index", {error: "Invalid URL. Please enter a valid URL"});
        return
    }

    instaAPI(url).then((response) => {
        console.log(response);
    })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})