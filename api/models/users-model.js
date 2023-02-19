const db = require("../../data/dbConfig.js");

const allUsers = () => {
    return db("users");
};
const findbyUserId = async(id) => {
    const user = await db("users as u")
        .select("u.user_id", "u.username", "u.password")
        .where({user_id: parseInt(id)}).first();
    return user;
};
const findByUserSpecial = async(special) => {
    const user = await db("users as u")
        .leftJoin("roles as r", "u.role_id", "r.role_id")
        .select("u.user_id", "u.username", "u.password", "r.rolename")
        .where(special).first();
    return user;
};

const insertUser = async(user) => {
    const {role_id} = await db("roles").where({rolename:user.rolename}).first();
    const rUser = {
        username:user.username,
        password:user.password,
        role_id:role_id
    }
    const cUId = (await db("users").insert(rUser))[0];
    return findbyUserId(cUId);  
}
module.exports = {allUsers,findbyUserId, findByUserSpecial,insertUser};
