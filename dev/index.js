const express = require('express')
const app = express()
const port = 44300

app.use(express.static('../'))
app.listen(port, () => console.log(`Dev server listening at http://localhost:${port}`))