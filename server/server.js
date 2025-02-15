const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let qrScanned = false; 

app.get("/api/qrstatus", (req, res) => {
  res.json({ scanned: qrScanned });
});

app.post("/api/qrscanned", (req, res) => {
  qrScanned = true;
  console.log("QR Code foi escaneado!");
  res.json({ message: "QR Code registrado", scanned: true });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
