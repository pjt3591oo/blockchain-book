let noti = require('../utils/noti/shipOrder')

async function a() {
	try{
		let a = await noti({
			SHIPPER_ID: "HMM",
			MANAGE_ID: "HLC",
			DOC_KEY: "123",
			InOut_MsgCode: 1
		})
		console.log(a)
	} catch (err) {
		console.log(err)
	}
}

a()
