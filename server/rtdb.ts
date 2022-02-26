import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseApp = initializeApp({
  apiKey: "f2096e51617690ae96da4e65b858a1e59997ff43",
  projectId: "dwf-m6-ff26c",
  authDomain: "dwf-m6-ff26c.firebaseapp.com",
});

const rtdb = getDatabase();

export { rtdb };
