import * as express from "express";
import { json } from "body-parser";
import { firestore, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as cors from "cors";
import * as path from "path";

const port = process.env.PORT || 4006;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const userCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

//verifica si existe la sala en base al short id:
app.post("/sala", (req, res) => {
  const { shortId } = req.body;

  roomsCollection
    .where("id", "==", shortId)
    .get()
    .then((searchResponse) => {
      if (!searchResponse.empty) {
        const owner = searchResponse.docs[0].get("owner");
        res.json({
          roomLongId: searchResponse.docs[0].id,
          owner,
        });
      } else {
        res.status(404).json({
          message: "no existe un room con ese id",
        });
      }
    });
});

app.post("/verify/:roomLongId", (req, res) => {
  const { roomLongId } = req.params;
  const { player, name } = req.body;
  const nameRef = rtdb.ref(`/chatrooms/${roomLongId}/currentGame/${player}`);
  nameRef
    .child("/name")
    .get()
    .then((nameSnap) => {
      if (nameSnap.val() !== "") {
        if (nameSnap.val() == name) {
          res.json({ message: "the player belongs to this room" });
        } else {
          res.status(404).json({
            message: "the name does not match any of the rooms players",
          });
        }
      } else {
        nameRef.update({ name }).then(() => {
          res.json({ message: "player 2 added to the game room" });
        });
      }
    })
    .catch((error) => res.json(error));
});

app.post("/online/:roomLongId", (req, res) => {
  const { roomLongId } = req.params;
  const { player } = req.body;

  const playerRef = rtdb.ref(`/chatrooms/${roomLongId}/currentGame/${player}`);

  playerRef
    .child("/online")
    .get()
    .then((snapshot) => {
      if (snapshot.val() == true) {
        res.status(404).json({
          message: `${player} is already online `,
        });
      } else {
        playerRef.update({ online: true }).then(() => {
          res.json({ message: `${player} is now online :)` });
        });
      }
    });
});

app.post("/offline/:roomLongId", (req, res) => {
  const { player } = req.body;
  const { roomLongId } = req.params;

  const playerRef = rtdb.ref(`/chatrooms/${roomLongId}/currentGame/${player}`);
  playerRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      playerRef.update({ online: false }).then(() => {
        res.json({ message: "user is now offline" });
      });
    } else {
      res.status(404).json({ message: "Error fetching player" });
    }
  });
});

//busca en firestore que usuario tiene ese nombre y si ya existe devuelve su id LARGO, sino lo crea
app.post("/auth", (req, res) => {
  const { name } = req.body;
  userCollection
    .where("name", "==", name)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCollection.add({ name }).then((docRef) => {
          res.json({
            id: docRef.id,
          });
        });
      } else {
        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});

// le pasa el id largo del usuario y se fija si en la colleccion de rooms si esta ese id asociado a algun rooom y si no existe crea un nuevo room con un id random
app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  const { userName } = req.body;
  roomsCollection
    .where("owner", "==", userId.id)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        roomsCollection
          .add({
            owner: userName,
            id: uuidv4().substring(0, 6),
          })
          .then((data) => {
            const roomId = data.id;
            const realtimeRoomRef = rtdb
              .ref(`/chatrooms/${roomId}`)
              .set({
                currentGame: {
                  player1: {
                    choice: "",
                    name: userName,
                    online: false,
                    start: false,
                  },
                  player2: {
                    choice: "",
                    name: "",
                    online: false,
                    start: false,
                  },
                },
              })
              .then(() => {
                res.json({ roomId });
              });
          });
      } else {
        res.json({
          roomId: searchResponse.docs[0].id,
        });
      }
    })
    .catch((error) => {
      res.json(error.message);
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  roomsCollection
    .doc(`${roomId}`)
    .get()
    .then((doc) => {
      const shortId = doc.get("id");
      res.json({
        shortId,
      });
    });
});

app.post("/start/:roomLongId", (req, res) => {
  const { player } = req.body;
  const { roomLongId } = req.params;

  var dataRef = rtdb.ref(`/chatrooms/${roomLongId}/currentGame/${player}`);
  dataRef.update({ start: true }).then(() => {
    res.json({ player });
  });
  // dataRef.get().then((snapshot) => {
  //   if (snapshot.exists()) {
  //   } else {
  //     res.json({ message: "No data available" });
  //   }
  // });
});

app.post("/choice/:player", (req, res) => {
  const { player } = req.params;
  const { choice, roomLongId } = req.body;

  var dataRef = rtdb.ref(`/chatrooms/${roomLongId}/currentGame/${player}`);
  dataRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      dataRef.update({ choice }).then(() => {
        res.json(`${player} choice is: ${choice}`);
      });
    } else {
      res.json("No data available");
    }
  });
});

app.post("/history/:roomLongId", (req, res) => {
  const { roomLongId } = req.params;
  const { winner, game } = req.body;

  const dataRef = rtdb.ref(`/chatrooms/${roomLongId}`);
  const previousGames = dataRef.child("/previousGames");

  previousGames
    .get()
    .then((snapshot) => {
      if (!snapshot.exists()) {
        dataRef.update({ previousGames: {} }).then((response) => {
          return response;
        });
      }
    })
    .then(() => {
      previousGames.push({
        game,
        winner,
      });
      res.json("game pushed to history");
    });
});

app.post("/reset/:roomLongId", (req, res) => {
  const { roomLongId } = req.params;
  const { player } = req.body;

  rtdb
    .ref(`/chatrooms/${roomLongId}/currentGame/${player}`)
    .update({ choice: "", start: false })
    .then(() => {
      res.json("player reset");
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
