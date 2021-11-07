const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.set("view engine", "ejs");

const optionsForMongoose = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const url = "mongodb://localhost:27017/ADP_Project";
mongoose.connect(url, optionsForMongoose);

const itemSchema = new mongoose.Schema({
    text: { type: String },
    check: { type: String }
});
const Item = new mongoose.model("item", itemSchema);

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

const newUserItems = [
    Item({ text: "Hello user, we are happy to see you use this app", check: "False" }),
    Item({ text: "Click on the text box above, add what you want to add and click on the + button to add new items", check: "False" }),
    Item({ text: "Click on the edit on the right of any existing item to edit it.", check: "False" }),
    Item({ text: "Click on the delete on the right of any existing item to delete it.", check: "False" })
];

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

app.get("/logout", function (req, res) {
    res.clearCookie("username");
    res.redirect("/login");
});

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

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at port 3000");
});
