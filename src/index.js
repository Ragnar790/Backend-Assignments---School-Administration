const express = require("express");
const initData = require("./InitialData");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET - GET ALL STD DATA
app.get("/api/student", (req, res) => {
	res.send(initData);
});

//GET- GETTING DATA OF STD WITH A GIVEN ID
app.get("/api/student/:stdId", (req, res) => {
	res.set({ "content-type": "application/json" });

	//checking if the filtered array(obj with the required id) size is not zero
	if (
		initData.filter((stdData) => stdData.id == req.params.stdId).length != 0
	) {
		//finding the obj with the given id
		res.send(initData.find((x) => x.id == req.params.stdId));
	} else res.sendStatus(404);
});

//POST - CREATE
app.post("/api/student", (req, res) => {
	const new_id = initData.length + 1;
	res.set({
		"content-type": "application/x-www-form-urlencoded",
		"content-type": "application/json",
	});
	if (req.body.name && req.body.division && req.body.currentClass) {
		initData.push({
			id: new_id,
			name: req.body.name,
			currentClass: Number(req.body.currentClass),
			division: req.body.division,
		});

		res.send(JSON.stringify({ id: new_id }));
	} else {
		res.sendStatus(400);
	}
});

//PUT - UPDATE
app.put("/api/student/:stdId", (req, res) => {
	res.set({ "content-type": "application/x-www-form-urlencoded" });

	//finding the obj
	const objToUpdate = initData.find((x) => x.id == req.params.stdId);
	if (
		(req.body.name || req.body.division || req.body.currentClass) &&
		//checking if req obj is present
		initData.some((x) => x.id == req.params.stdId)
	) {
		//UPDATING (IF IN REQ BODY KEY IS PRESENT, CHANGE. ELSE KEEP IT SAME)
		objToUpdate.name = req.body.name ? req.body.name : objToUpdate.name;
		objToUpdate.currentClass = req.body.currentClass
			? Number(req.body.currentClass)
			: objToUpdate.currentClass;
		objToUpdate.division = req.body.division
			? req.body.division
			: objToUpdate.division;
		res.end();
		console.log("updated");
	} else {
		res.sendStatus(400);
	}
});

//DELETE
app.delete("/api/student/:stdId", (req, res) => {
	if (initData.some((x) => x.id == req.params.stdId)) {
		const datatIndex = initData.findIndex((x) => x.id == req.params.stdId);
		delete initData[datatIndex];
		// initData[datatIndex] = { id: req.params.id };
		res.end();
		console.log("deleted");
	} else {
		res.sendStatus(404);
	}
});
app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
