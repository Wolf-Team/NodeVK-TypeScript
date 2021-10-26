import Session from "./Session.js";
(async () => {
	const session = new Session({
		token: ""
	});
	try {
		console.log(await session.groups.getMembers(200036647, 0, 1000));
	} catch (e) {
		console.error(e);
	}
})()
