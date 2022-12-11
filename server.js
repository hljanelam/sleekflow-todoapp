const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// models
const ToDoItem = require("./models/ToDoItem");

const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

var corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the to do list application." });
});

// require("./app/routes/tutorial.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// create to do item
app.post('/todo/create', async (req, res) => {
    const toDoItem = new ToDoItem({
        name: req.body.name,
        catagory: req.body.catagory,
        description: req.body.description,
        dueDate: req.body.dueDate,
        status: req.body.status,
    });
    try {
        await toDoItem.save();
        res.json(toDoItem);
        console.log("Created to-do item!");
        // res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// get to do items
app.get("/todo/get", (req, res) => {
    ToDoItem.find({}, (err, items) => {
        console.log("Retrieved all to-do items!");
        res.json(items);
    });
});

// edit to do item
app.post("/todo/update/:id", (req, res) => {
    const id = req.params.id;
    ToDoItem.findByIdAndUpdate(id, req.body,
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated to-do item : ", docs);
                res.send("Updated to-do item!");
            }
        });
});

// delete to do item by id
app.delete('/todo/delete/:id', (req, res) => {
    const id = req.params.id;
    ToDoItem.findByIdAndRemove(id,
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Deleted to-do item: ", docs);
                res.json(docs);
            }
        });
 })

 // filter
app.post('/todo/filter', (req, res) => {
    const filters = req.body;
    ToDoItem.find(filters,
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Filtered results : ", docs);
                res.json(docs);
            }
        });
 })

  // sort by dueDate
  // order: 1 for ascending order, -1 for descending order
app.post('/todo/sort', (req, res) => {
    const order = req.body.order;
    let flag = 0;
    if(order == 'descending') {
        flag = -1;
    } else if (order == 'ascending') {
        flag = 1;
    } else {
        res.send("Please enter a valid order value!");
    }

    ToDoItem.find({},
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Sorted results : ", docs);
                res.json(docs);
            }
        }).sort({"dueDate": order});

 })
