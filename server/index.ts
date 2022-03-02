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

app.post("/sala", (req, res) => {
  const { name } = req.body;
  const { shortId } = req.body;

  roomsCollection
    .where("id", "==", shortId)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(404).json({
          message: "no existe un room con ese id",
        });
      } else {
        const roomLongId = searchResponse.docs[0].id;
        const rtdbRef = rtdb.ref(
          `/chatrooms/${roomLongId}/currentGame/player2`
        );
        rtdbRef
          .child("/name")
          .get()
          .then((snap) => {
            const snapValue = snap.val();
            if (snapValue === name || snapValue === "") {
              console.log(
                "the room is available, or your name matches the name rooms player two name"
              );
              rtdbRef.update({ online: true, name }).then(() => {
                console.log("player 2 is now online");
                res.json({
                  roomLongId: roomLongId,
                });
              });
            } else {
              res.status(404).json({
                message: `your name doesnt match any of the room's players`,
              });
            }
          });
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
    .where("owner", "==", userId)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        roomsCollection
          .add({
            owner: userId,
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
                    online: true,
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
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  // console.log(roomId);
  roomsCollection
    .doc(`${roomId}`)
    .get()
    .then((doc) => {
      const shortId = doc.get("id");
      // console.log(shortId);
      res.json({
        shortId,
      });
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
