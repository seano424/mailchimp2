const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})



app.post("/", function(req, res) {

  //Variables for receiving data using body-parser
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // DATA We created so this is what we are getting from Mailchimp
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  // Turn data into JSON
  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/3acf8df433"

  const options = {
    method: "POST",
    // username and api key:
    auth: "sean:89b92ac82b266a53e3120c4ce5de58c2-us10"
  }

  const request = https.request(url, options, function(response) {

    //Where your viewers will go if they get a correct response or error;

    if(response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }


    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

})

app.post("/failure", function(req, res) {
  res.redirect('/');
})

app.post("/homepage", function(req, res) {
  res.sendFile(__dirname + "/homepage.html");
})

app.listen(port, function () {
  console.log(`Server Starts on ${port}`)
});

//api key: 89b92ac82b266a53e3120c4ce5de58c2-us10
//audience id: 3acf8df433
