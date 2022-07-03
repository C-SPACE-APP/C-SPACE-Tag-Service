require('dotenv').config()

module.exports = async (database) => {
    try {
        await database.connect(
            `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        console.log(`Connected to Database`);
    } catch(err) {
        console.log(`Error connecting to Database: ${err}`);
    }
}