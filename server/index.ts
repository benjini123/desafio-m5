import * as express from "express";
import { json } from "body-parser";
import { firestore, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";
import { set, ref, push, getDatabase } from "firebase/database";
import * as cors from "cors";
import * as path from "path";
import { state } from "../client/state";

const port = process.env.PORT || 4006;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const userCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

//toma el input y si no existe una cuenta asignada a ese mail la crea y devuelve el ID de ese usuario creado
app.post("/signup", (req, res) => {
  const email = req.body.email;
  const nombre = req.body.nombre;

  userCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCollection
          .add({
            email,
            nombre,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
            });
          });
      } else {
        res.status(400).json({
          message: "user already exists",
        });
      }
    });

  res.json(req.body);
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
            const realtimeRoomRef = rtdb.ref(`/chatrooms/${roomId}`).set({
              currentGame: {
                player1: {
                  choice: "",
                  id: `${userId}`,
                  online: true,
                  start: true,
                },
                player2: {
                  choice: "",
                  id: "",
                  online: false,
                  start: false,
                },
              },
            });
            res.json({ roomId });
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

//         roomRef.set({}).then(() => {
//           const roomLongId = roomRef.key;
//           const roomId = 1000 + Math.floor(Math.random() * 999);
//           roomsCollection
//             .doc(roomId.toString())
//             .set({
//               rtdbRoomId: roomLongId,
//             })
//             .then(() => {
//               res.json({
//                 id: roomId.toString(),
//               });
//             });
//         });
//       } else {
//       }

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;

  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomsCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
