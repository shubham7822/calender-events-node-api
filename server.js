const express = require("express");
const calendarRoute = require("./routes/calendarRoute");
const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/calendar", calendarRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
