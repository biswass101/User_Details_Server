require('dotenv').config()
const app = require('./app')
const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.status(200).send('Server is OK!!')
})

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
})