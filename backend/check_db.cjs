require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId('6a0e7c78a82f740f7262629e') });
    console.log(JSON.stringify(user, null, 2));
    process.exit(0);
});
