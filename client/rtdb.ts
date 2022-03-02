import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "f2096e51617690ae96da4e65b858a1e59997ff43",
  projectId: "dwf-m6-ff26c",
  // databaseURL: "https://dwf-m6-ff26c-default-rtdb.firebaseio.com/",
  authDomain: "dwf-m6-ff26c.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
export { rtdb };
