"use strict";
exports.__esModule = true;
var express = require("express");
var db_1 = require("./db");
var uuid_1 = require("uuid");
var cors = require("cors");
var path = require("path");
var port = process.env.PORT || 4006;
var app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
var userCollection = db_1.firestore.collection("users");
var roomsCollection = db_1.firestore.collection("rooms");
//verifica si existe la sala en base al short id:
app.post("/sala", function (req, res) {
    var shortId = req.body.shortId;
    roomsCollection
        .where("id", "==", shortId)
        .get()
        .then(function (searchResponse) {
        if (!searchResponse.empty) {
            var owner = searchResponse.docs[0].get("owner");
            res.json({
                roomLongId: searchResponse.docs[0].id,
                owner: owner
            });
        }
        else {
            res.status(404).json({
                message: "no existe un room con ese id"
            });
        }
    });
});
app.post("/verify/:roomLongId", function (req, res) {
    var roomLongId = req.params.roomLongId;
    var _a = req.body, player = _a.player, name = _a.name;
    var nameRef = db_1.rtdb.ref("/chatrooms/".concat(roomLongId, "/currentGame/").concat(player));
    var onlineRef = nameRef.child("/online");
    nameRef
        .child("/name")
        .get()
        .then(function (nameSnap) {
        if (nameSnap.val() !== "") {
            if (nameSnap.val() == name) {
                if (onlineRef) {
                    res.status(400).json({ message: "player is already online" });
                }
                else {
                    res.json({ message: "the player belongs to this room" });
                }
            }
            else {
                res.status(404).json({
                    message: "the name does not match any of the rooms players"
                });
            }
        }
        else {
            nameRef.update({ name: name }).then(function () {
                res.json({ message: "player 2 added to the game room" });
            });
        }
    })["catch"](function (error) { return res.json(error); });
});
app.post("/online/:roomLongId", function (req, res) {
    var roomLongId = req.params.roomLongId;
    var player = req.body.player;
    var playerRef = db_1.rtdb.ref("/chatrooms/".concat(roomLongId, "/currentGame/").concat(player));
    playerRef
        .child("/online")
        .get()
        .then(function (snapshot) {
        if (snapshot.val() == true) {
            res.status(404).json({
                message: "".concat(player, " is already online ")
            });
        }
        else {
            playerRef.update({ online: true }).then(function () {
                res.json({ message: "".concat(player, " is now online :)") });
            });
        }
    });
});
app.post("/offline/:roomLongId", function (req, res) {
    var player = req.body.player;
    var roomLongId = req.params.roomLongId;
    var playerRef = db_1.rtdb.ref("/chatrooms/".concat(roomLongId, "/currentGame/").concat(player));
    playerRef.get().then(function (snapshot) {
        if (snapshot.exists()) {
            playerRef.update({ online: false, start: false }).then(function () {
                res.json({ message: "user is now offline" });
            });
        }
        else {
            res.status(404).json({ message: "Error fetching player" });
        }
    });
});
//busca en firestore que usuario tiene ese nombre y si ya existe devuelve su id LARGO, sino lo crea
app.post("/auth", function (req, res) {
    var name = req.body.name;
    userCollection
        .where("name", "==", name)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            userCollection.add({ name: name }).then(function (docRef) {
                res.json({
                    id: docRef.id
                });
            });
        }
        else {
            res.json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
// le pasa el id largo del usuario y se fija si en la colleccion de rooms si esta ese id asociado a algun rooom y si no existe crea un nuevo room con un id random
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    var userName = req.body.userName;
    roomsCollection
        .where("owner", "==", userId.id)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            roomsCollection
                .add({
                owner: userName,
                id: (0, uuid_1.v4)().substring(0, 6)
            })
                .then(function (data) {
                var roomId = data.id;
                var realtimeRoomRef = db_1.rtdb
                    .ref("/chatrooms/".concat(roomId))
                    .set({
                    currentGame: {
                        player1: {
                            choice: "",
                            name: userName,
                            online: false,
                            start: false
                        },
                        player2: {
                            choice: "",
                            name: "",
                            online: false,
                            start: false
                        }
                    }
                })
                    .then(function () {
                    res.json({ roomId: roomId });
                });
            });
        }
        else {
            res.json({
                roomId: searchResponse.docs[0].id
            });
        }
    })["catch"](function (error) {
        res.json(error.message);
    });
});
app.get("/rooms/:roomId", function (req, res) {
    var roomId = req.params.roomId;
    roomsCollection
        .doc("".concat(roomId))
        .get()
        .then(function (doc) {
        var shortId = doc.get("id");
        res.json({
            shortId: shortId
        });
    });
});
app.post("/start/:roomLongId", function (req, res) {
    var player = req.body.player;
    var roomLongId = req.params.roomLongId;
    var dataRef = db_1.rtdb.ref("/chatrooms/".concat(roomLongId, "/currentGame/").concat(player));
    dataRef.update({ start: true }).then(function () {
        res.json({ player: player });
    });
    // dataRef.get().then((snapshot) => {
    //   if (snapshot.exists()) {
    //   } else {
    //     res.json({ message: "No data available" });
    //   }
    // });
});
app.post("/choice/:player", function (req, res) {
    var player = req.params.player;
    var _a = req.body, choice = _a.choice, roomLongId = _a.roomLongId;
    var dataRef = db_1.rtdb.ref("/chatrooms/".concat(roomLongId, "/currentGame/").concat(player));
    dataRef.get().then(function (snapshot) {
        if (snapshot.exists()) {
            dataRef.update({ choice: choice }).then(function () {
                res.json("".concat(player, " choice is: ").concat(choice));
            });
        }
        else {
            res.json("No data available");
        }
    });
});
app.post("/history/:roomLongId", function (req, res) {
    var roomLongId = req.params.roomLongId;
    var _a = req.body, winner = _a.winner, game = _a.game;
    var dataRef = db_1.rtdb.ref("/chatrooms/".concat(roomLongId));
    var previousGames = dataRef.child("/previousGames");
    previousGames
        .get()
        .then(function (snapshot) {
        if (!snapshot.exists()) {
            dataRef.update({ previousGames: {} }).then(function (response) {
                return response;
            });
        }
    })
        .then(function () {
        previousGames.push({
            game: game,
            winner: winner
        });
        res.json("game pushed to history");
    });
});
app.post("/reset/:roomLongId", function (req, res) {
    var roomLongId = req.params.roomLongId;
    var player = req.body.player;
    db_1.rtdb
        .ref("/chatrooms/".concat(roomLongId, "/currentGame/").concat(player))
        .update({ choice: "", start: false })
        .then(function () {
        res.json("player reset");
    });
});
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:".concat(port));
});
