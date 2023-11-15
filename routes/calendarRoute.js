const express = require("express");
const moment = require("moment")
const calendarRoute = express.Router();


const  operationToDo = (text) => {
  const contains = (str) => text.includes(str);
  const isAdd = contains("add");
  const isSubtract = contains("sub") || contains("subtract");

  if (contains("days")) {
    return isAdd ? "add" : isSubtract ? "subtract" : null;
  }

  if (contains("weeks")) {
    return isAdd ? "addWeeks" : isSubtract ? "subWeeks" : null;
  }

  if (contains("months")) {
    return isAdd ? "addMonths" : isSubtract ? "subMonths" : null;
  }

  if (contains("today") && !contains("weeks") && !contains("months")) {
    return isAdd ? "add" : isSubtract ? "subtract" : null;
  }

  if (contains("tomorrow") && !contains("weeks") && !contains("months")) {
    return isAdd ? "add" : isSubtract ? "subtract" : null;
  }

  return null;
};


calendarRoute.post("/events", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Request body not found" });
  }

  let value = null;

  const numericRegex = /\b(\d+)\b/g;
  const dateRegex = /\b(\d{1,2}-\d{1,2}-\d{2,4})\b/g;
  const numericValues = text.match(numericRegex);
  const dateValues = text.match(dateRegex);

  if (numericValues && Array.isArray(numericValues)) {
    value = numericValues?.[0]; 
  }

  const operation = operationToDo(text);


  if (dateValues?.[0]) {
    currentDate = dateValues[0];
  } else if(text.includes("today")){
    currentDate = moment();
  }else if(text.includes("tomorrow")){
    currentDate = moment().add(1,"days");
  }else{
    currentDate = moment(value,'MM-DD-YYYY')
  }


  let resultDate;
  switch (operation) {
    case 'add':
      resultDate = moment(currentDate,'YY-MM-DD')?.add(value, 'days');
      break;
    case 'subtract':
      resultDate =  moment(currentDate,'YY-MM-DD')?.subtract(value, 'days');
      break;
    case 'addWeeks':
      resultDate =  moment(currentDate,'YY-MM-DD')?.add(value, 'weeks');
      break;
   case 'subWeeks':
        resultDate =  moment(currentDate,'YY-MM-DD')?.subtract(value, 'weeks');
        break;
    case 'addMonths':
      resultDate =  moment(currentDate,'YY-MM-DD')?.add(value, 'months');
      break;
    case 'subMonths':
      resultDate =  moment(currentDate,'YY-MM-DD')?.subtract(value, 'months');
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation' });
  }


  if(!resultDate || resultDate === "Invalid Date"){
    return res.status(400).json({ error: 'Invalid date format' });
  }

  res.json({
    response: resultDate.format("YYYY-MM-DD"),
    statusCode: 200,
    message: "Date fetched successfully",
  });
});



calendarRoute.get("/getevents", (req, res) => {
  res.send("Fetch all events");
});

module.exports = calendarRoute;
