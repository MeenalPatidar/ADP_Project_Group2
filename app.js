// import express for server, mongoose for connection with mongodb
// and cookie parser for user login persistence
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// initialise server and plugins to be used
// ejs for templates and passing of variables from backend to frontend
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.set("view engine", "ejs");

// required for latest mongoose
const optionsForMongoose = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// connect to mongodb database
const url = "mongodb://localhost:27017/ADP_Project";
mongoose.connect(url, optionsForMongoose);

// speciality of mongoose: convert noSQL to semi-SQL for the sake of convenience
// schema and model(format to follow in simple terms) for items
const itemSchema = new mongoose.Schema({
    text: { type: String },
    check: { type: String }
});
const Item = new mongoose.model("item", itemSchema);

// schema for users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    itemList: [itemSchema]
});
const User = new mongoose.model("user", userSchema)

// for any new user, these are default instructions which would show up as todo list items
const newUserItems = [
    Item({ text: "Hello user, we are happy to see you use this app", check: "False" }),
    Item({ text: "Click on the text box above, add what you want to add and click on the + button to add new items", check: "False" }),
    Item({ text: "Click on the edit on the right of any existing item to edit it.", check: "False" }),
    Item({ text: "Click on the delete on the right of any existing item to delete it.", check: "False" }),
    Item({ text: "Click on the checkbox on the left of any existing item to strike it through.", check: "False" })
];

// the home page route
// checks if user is logged in, if yes shows the list corresponding to the user
// if not, redirects to the login page
app.get("/", function (req, res) {
    var userName = req.cookies.username;
    if (userName) {
        User.findOne({ username: userName }, function (err, user) {
            if (!err) {
                if (user) {
                    res.render("home", {
                        user: user.username,
                        list: user.itemList,
                        userID: user._id
                    });
                } else {
                    res.redirect("/login");
                }
            } else {
                res.send(err);
            }
        });
    } else {
        res.redirect("/login");
    }
});

// the login page route
app.get("/login", function (req, res) {
    var bad_auth = req.query.msg ? true : false;
    if (bad_auth) {
        res.render("login", {
            error: "Incorrect Password"
        });
    } else {
        res.render("login", {
            error: ""
        });
    }
});

// the post route where the login data is collected and authenticated
// also the cookie is created here for the user login to persist
app.post("/login", function (req, res) {
    const newUser = {
        username: req.body.name,
        password: req.body.password,
    };
    User.findOne({ username: newUser.username }, function (err, user) {
        if (!err) {
            if (user) {
                if (user.password !== newUser.password) {
                    res.redirect("/login?msg=fail");
                } else {
                    res.cookie("username", user.username);
                    res.redirect("/");
                }
            } else {
                res.redirect("/login?msg=fail");
            }
        } else {
            res.redirect("/login?msg=fail");
        }
    });
});

// the register page route
app.get("/register", function (req, res) {
    var bad_auth = req.query.msg ? true : false;
    if (bad_auth) {
        res.render("register", {
            error: "Username already exists, please choose some other username"
        });
    }
    res.render("register", {
        error: ""
    });
});

// the post route where the register function is handled
// in this route too the cookie is made so that
// the user does not have to relogin again after registration
app.post("/register", function (req, res) {
    const newUser = new User({
        username: req.body.name,
        password: req.body.password,
        itemList: newUserItems
    });
    User.findOne({ username: newUser.username }, function (error, user) {
        if (!error) {
            if (!user) {
                User.insertMany([newUser], function (err, docs) {
                    if (!err) {
                        res.cookie("username", newUser.username);
                        res.redirect("/");
                    } else {
                        res.redirect("/register?msg=fail");
                    }
                });
            } else {
                res.redirect("/register?msg=fail");
            }
        }
    });
});

// the post route for adding new items
// this is where the data for new items is sent and added to the user's profile
app.post("/add", function (req, res) {
    const userName = req.body.user;
    const newItem = Item({ text: req.body.item, check: "False" });
    User.findOne({ username: userName }, function (err, user) {
        if (!err) {
            if (user) {
                user.itemList.push(newItem);
                user.save();
                res.redirect("/");
            } else {
                res.redirect("/login");
            }
        } else {
            res.send("error");
        }
    });
});

// the post route for deleting a list item
app.post("/delete", function (req, res) {
    const userId = req.body.userId;
    const elemId = req.body.elemID;
    User.findByIdAndUpdate(userId, { $pull: { itemList: { _id: elemId } } }, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });

});

// the post route for updating a list item
app.post("/update", function (req, res) {
    const item_text = req.body.list_name;
    const userId = req.body.userId;
    const elemId = req.body.elemID;
    User.updateOne({ "_id": userId, "itemList._id": elemId }, { $set: { "itemList.$.text": item_text } }, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });

});

// this is a route which checks whether a username is already taken or not
// depending on the page(login or register) the function works differently
// on the register page one cannot register if the username is already taken
// on the login page one cannot login unless the username is already taken
app.post("/check", function (req, res) {
    const userName = req.body.user;
    User.findOne({ username: userName }, function (err, user) {
        if (!err) {
            if (user) {
                res.send(true);
            } else {
                res.send(false);
            }
        } else {
            res.send(err);
        }
    });
});

// the logout page
app.get("/logout", function (req, res) {
    res.clearCookie("username");
    res.redirect("/login");
});

// this route handles the strike through part in the items
// strike through roughly means that the user has postponed the task for some other time
app.post("/updateStatus", function (req, res) {
    const userId = req.body.userId;
    const elemID = req.body.elemID;
    User.findById(userId, function (err, user) {
        if (!err) {
            if (user) {
                user.itemList.forEach(function (element) {
                    if (element._id == elemID) {
                        if (element.check === "False") {
                            element.check = "True";
                        } else {
                            element.check = "False";
                        }
                    }
                });
                user.save(function (error) {
                    if (!error) {
                        res.redirect("/");
                    } else {
                        console.log(error);
                    }
                });
            }
        } else {
            console.log(err);
        }
    });
});

// start the server on process.env.PORT, which comes when we host it on a remote server
// else host on port 3000 locally
app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at port 3000");
});
