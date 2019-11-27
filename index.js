const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('<h1 id="h1">Hello World!</h1> <script>document.getElementById("h1").innerHTML = "Hello JavaScript!";</script>'))
app.get('/yes', (req, res) => res.send('Yesss!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
