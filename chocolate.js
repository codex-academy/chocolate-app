module.exports = function(pool) {

    async function list() {
        const result = await pool.query("select * from chocolate order by name asc");
        return result.rows
    }

    async function insert(name, qty) {
        await pool.query('insert into chocolate (name, qty) values ($1, $2)', [name, qty])
    }

    async function incrementQtyById(id) {
        await pool.query("update chocolate set qty = (qty + 1) where id = $1", [id]);
    }

    async function decrementQtyById(id) {
        pool.query("update chocolate set qty = qty - 1 where id = $1 and (qty - 1) >= 0", [id]);
    }

    async function incrementQtyByName(name) {
        await pool.query("update chocolate set qty = (qty + 1) where name = $1", [name]);
    }

    async function decrementQtyById(id) {
        pool.query("update chocolate set qty = qty - 1 where id = $1 and (qty - 1) >= 0", [id]);
    }

    async function decrementQtyByName(name) {
        pool.query("update chocolate set qty = qty - 1 where name = $1 and (qty - 1) >= 0", [name]);
    }

    async function incrementQtyByName(name) {
        pool.query("update chocolate set qty = qty + 1 where name = $1", [name]);
    }

    async function doesExist(name) {
        const result = await pool.query("select count(*) from chocolate where name = $1 ", [name]);
        return result.rows[0].count > 0;
    }

    return {
        list,
        insert,
        incrementQtyById,
        incrementQtyByName,
        decrementQtyById,
        decrementQtyByName,
        incrementQtyByName,
        doesExist

    }
}