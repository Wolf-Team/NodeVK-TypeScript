import Session from "./Session.js";
(async () => {
	const session = new Session({
		token: "734ff6b5e31db7e973e44d563c0a6102a9840888680610a9b3acfd684b29ffc1ce7cd887048d4844e9680"
	});
	try {
		console.log(await session.groups.getMembers(200036647, 0, 1000));
	} catch (e) {
		console.error(e);
	}
})()
