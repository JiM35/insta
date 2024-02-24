// index.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

const port = 3000
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
});

app.post('/download', async (req, res) => {
    const url = req.body.url

    if (!url || !url.startsWith("https://www.instagram.com/")) {
        res.render("index", {error: "Invalid URL. Please enter a valid URL"});
        return;
    }

    try {
        // Extracting media URL using Instagram API
        const mediaResponse = await axios.get(`https://www.instagram.com/p/` + url.split('/p/')[1] + '/?__a=1');
        
        // Log the entire response for debugging
        console.log("Instagram API Response:", mediaResponse.data);

        // Determine file extension based on media type
        const ext = mediaResponse.data.graphql.shortcode_media.is_video ? 'mp4' : 'jpg';

        // Access the media URL correctly based on the actual structure of the response
        const mediaUrl = mediaResponse.data.graphql.shortcode_media.display_url || mediaResponse.data.graphql.shortcode_media.video_url;

        // Download the file
        downloadFile(res, mediaUrl, ext);
    } catch (error) {
        console.error("Error fetching Instagram media:", error);
        res.status(400).send("Error fetching Instagram media");
    }
});

function downloadFile(res, url, ext) {
    axios({
        method: 'get',
        url: url,
        responseType: 'arraybuffer',
    }).then(response => {
        const fileName = Date.now() + "." + ext;
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.send(Buffer.from(response.data, 'binary'));
    }).catch(error => {
        console.error("Error downloading media:", error);
        res.status(400).send("Error downloading media");
    });
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
