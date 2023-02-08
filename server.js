const express = require("express"); //Get Express
var cors = require('cors')
const app = express(); // Initialize Express
const cluster = require('cluster');


const connectDB = require("./config/db");
const morgan = require("morgan");
const config = require("./config/config");
const hsts = require('hsts')
const helmet = require("helmet");
const nocache = require("nocache");


// connect db
connectDB();


// Initialize Middleware
app.use(express.json({ extended: false }));
app.use(helmet());

app.use(morgan("combined"));
app.use(nocache());

// Enable CORS
app.use(cors());
app.use(hsts({
    maxAge: 7776000  // 90 days in seconds
}))



app.options("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //other headers here
    res.status(200).end();
});




app.get("/", (req, res) => res.send("Server Root"));
app.get("/ping", (req, res) => res.send("pong"));


app.use("/api/v1/auth", require("./routes/api/auth"));
app.use("/api/v1/plaid", require("./routes/api/plaid"));









//404 handling
app.use(function (req, res, next) {
    res.status(404).send({ error: "404 Error Not Found" });
});
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV == "staging") {
    app.listen(PORT);
}

if (process.env.NODE_ENV == "production") {
    console.log(process.env.NODE_ENV)
    //running in cluster mode
    var workers = {},
        count = require('os').cpus().length;

    function spawn() {
        var worker = cluster.fork();
        workers[worker.pid] = worker;
        return worker;
    }

    if (cluster.isMaster) {
        for (var i = 0; i < count; i++) {
            spawn();
        }
        cluster.on('disconnect', function (worker) {
            console.error('disconnect!');
            spawn();
        });
    } else {
        app.listen(PORT);
    }
}


process.on('uncaughtException', function (err) {
    console.log(`Server unavailable : ${err}`)
});

//test comment