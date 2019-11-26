var request = require('request')

function get (req, res) {
  console.log ("Backend.get")
  res.send ("Get")
}

function append (req, res) {
  console.log ("Backend.append")
  res.send ("Append")
}

module.exports = {
  get,
  append
}
