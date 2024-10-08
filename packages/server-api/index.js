const express = require("express");
const fs = require("fs");
const cors = require("cors");
var path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/vms", (req, res) => {
    let jsonData = []

    const data = fs.readFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/db.json'));
    if (data.length !== 0) {
        jsonData = JSON.parse(data);
    }

    res.json(jsonData)
});


app.get("/tasks", (req, res) => {
    let jsonData = []

    const data = fs.readFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/tasks.json'));
    if (data.length !== 0) {
        jsonData = JSON.parse(data);
    }

    res.json(jsonData)
});

app.post("/vms", (req, res) => {
	const content = req.body;
    let jsonData = []

	if (!content) {
		return res.sendStatus(400);
	}

    // with 'utf-8' part the function returns string instead of buffer
    const vms = fs.readFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/db.json'), 'utf8');
    if (vms.length !== 0) {
        jsonData = JSON.parse(vms);
    }

    jsonData.push(content);

    fs.writeFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/db.json'), JSON.stringify(jsonData));

    res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(content));
});

app.put("/vms", (req, res) => {
    const content = req.body;
    let dbJsonData = []

	if (!content) {
		return res.sendStatus(400);
	}

    // with 'utf-8' part the function returns string instead of buffer
    const vms = fs.readFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/db.json'), 'utf8');
    if (vms.length !== 0) {
        dbJsonData = JSON.parse(vms);
    }

    for (let i = 0; i < dbJsonData.length; i++) {
        if (dbJsonData[i].id === content.id) {
            dbJsonData[i].status = content.status;
            break;
        }
    }

    fs.writeFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/db.json'), JSON.stringify(dbJsonData));

    res.sendStatus(204)
})

app.delete("/vms/:id", (req, res) => {
    const id = req.params.id;
    let dbJsonData = []

	if (!id) {
		return res.sendStatus(400);
	}

    // with 'utf-8' part the function returns string instead of buffer
    const vms = fs.readFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/db.json'), 'utf8');
    if (vms.length !== 0) {
        dbJsonData = JSON.parse(vms);
    }

    const changedJsonData = dbJsonData.filter(item => item.id !== id);

    fs.writeFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/db.json'), JSON.stringify(changedJsonData));

    res.sendStatus(204)
})

app.post("/addSpotInstances", (req, res) => {

    // Unzip an array which consists of req.body
	const content = req.body;
    let jsonData = []

	if (!content) {
		return res.sendStatus(400);
	}

    const vms = fs.readFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/instances.json'), 'utf8');
    if (vms.length !== 0) {
        jsonData = JSON.parse(vms);
    }

    for (let i = 0; i < content.length; i++) {
        jsonData.push(content[i]);
    }

    fs.writeFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/instances.json'), JSON.stringify(jsonData));

    res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(content));
});

app.get("/getSpotInstance", (req, res) => {
    let jsonData = []

    const data = fs.readFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/instances.json'), 'utf8');
    if (data.length !== 0) {
        jsonData = JSON.parse(data);
    }

    res.json(jsonData);

});

app.delete("/deleteSpotInstance/:id", (req, res) => {
    const id = req.params.id;
    let dbJsonData = []

	if (!id) {
		return res.sendStatus(400);
	}

    // with 'utf-8' part the function returns string instead of buffer
    const vms = fs.readFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/instances.json'), 'utf8');
    if (vms.length !== 0) {
        dbJsonData = JSON.parse(vms);
    }

    const changedJsonData = dbJsonData.filter(item => !item.tag.includes(id));

    fs.writeFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/instances.json'), JSON.stringify(changedJsonData));

    res.sendStatus(204)
})


app.post("/vms/note", (req, res) => {
    console.log(req)

    const content = req.body;
    let dbJsonData = []

	if (!content) {
		return res.sendStatus(400);
	}

    // with 'utf-8' part the function returns string instead of buffer
    const vms = fs.readFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/db.json'), 'utf8');
    if (vms.length !== 0) {
        dbJsonData = JSON.parse(vms);
    }

    for (let i = 0; i < dbJsonData.length; i++) {
        if (dbJsonData[i].id === content.id) {
            dbJsonData[i].note = content.note;
            break;
        }
    }

    fs.writeFileSync(path.resolve(__dirname, '../vm-organizer/src/assets/db.json'), JSON.stringify(dbJsonData));

    res.sendStatus(204)

})



app.listen(3000, () => console.log("API Server is running..."));