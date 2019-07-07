let terminal = require('../utils/noti/terminal')


async function a() {

	try{

		await terminal({
			to: "HPNTC050",
			DOC_KEY: "1",
			InOut_MsgCode: 1
		})
	} catch (err) {

		console.log(err)
	}
	

}

a()
