
const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');
const PORT = 8899;
const baseURL = `/www.reddit.com/r/`;

app.use(express.static('./'));
app.use(cors());

{
    app.get(`${baseURL}:searchTerm`, function (req, res, next) {
        const { searchTerm } = req.params;
        if (!searchTerm) {
            res.status(400).send("Search term is empty");
            return;
        }

        fetch(`https:/${baseURL}/${searchTerm}`)
            .then(searchRes => searchRes.json())
            .then(payload => res.json(payload))
            .catch(error => console.log(error.message))
    })
}

app.listen(PORT, function () {
    console.log(`Server listening on port ${PORT} - localhost:${PORT}`);
})