const db = require("../db.js")


async function SelecionaUsuarios() {

    const conn = await db.connect();

    const rows = conn.query("select * from gym_star.users;")

    //console.log(rows.length)

    return await rows;
}



module.exports = {
    SelecionaUsuarios
}