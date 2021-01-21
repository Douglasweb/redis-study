async function connect() {

    try {
        if (global.connection && global.connection.state !== 'disconnected')
            return global.connection;

        const mysql = require("mysql2/promise");
        const datab = process.env.DADOS_BANCO;
        const connection = await mysql.createConnection(datab);
        console.log("Conectou no MySQL!");
        global.connection = connection;
        return connection;
    } catch (err) {
        console.log(err);
    }

}

//connect();

module.exports = {
    connect
}