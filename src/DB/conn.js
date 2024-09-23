const mongoose = require('mongoose');
const DB = process.env.DATABASE_TEST;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Database connnection successful`);
}).catch((err) => console.log(`no connection` + err));