module.exports = function(pool) {
async function addChocolate(name,qty){
await pool.query('insert into chocolate (name,qty) values($1,$2)',[name,qty])

}
	async function list() {
		const result = await pool.query("select * from chocolate");
		return result.rows
	}

	async function  incrementQtyById(id) {
		await pool.query("update chocolate set qty = (qty + 1) where id = $1", [id]);
	}

	async function  decrementQtyById(id) {
		pool.query("update chocolate set qty = qty - 1 where id = $1 and (qty - 1) >= 0", [id]);
	}

	async function  incrementQtyByName(name) {
		await pool.query("update chocolate set qty = (qty + 1) where name = $1", [name]);
	}

	async function  decrementQtyById(id) {
		pool.query("update chocolate set qty = qty - 1 where id = $1 and (qty - 1) >= 0", [id]);
	}

	async function  decrementQtyByName(name) {
		pool.query("update chocolate set qty = qty - 1 where name = $1 and (qty - 1) >= 0", [name]);
	}

	return {
		list,
		incrementQtyById,
		incrementQtyByName,
		decrementQtyById,
		decrementQtyByName,
		addChocolate
	}
}