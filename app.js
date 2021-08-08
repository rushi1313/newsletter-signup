const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//to add css and images i.e. to add static files to the server we need one folder named public and we need to define one method
app.use(express.static("public"));

//to use body parser
app.use(bodyParser.urlencoded({extended:true}));

//get request to the html page
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});


// we have to make post request so we can accept input from html form
app.post("/", function(req,res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

//using inpute data to create a string which will be coverted to JSON and will be post to API
//An array of objects, each representing a specific list member.
  const data = {
    members: [{
      email_address:email,   //property of member of the mailchimp api ////Email address for a subscriber.
      status:"subscribed",    //property of member of the mailchimp api
      //Subscriber's current status. Possible values: "subscribed", "unsubscribed", "cleaned", "pending", "transactional", or "archived".
      merge_fields :{          //property of member of the mailchimp api //An individual merge var and value for a member
        FNAME: firstName,        //var and its value taken from body post request
        LNAME: lastName,       //var and its value taken from body post request
      }
    }
    ]
  }
  //we have to send the JSON data to mailchimp api server so convert "data" object into JSON format
  var jsonData = JSON.stringify(data);

  // here we want to post data to mailchimp server so we have to make post request
  const url = "https://us6.api.mailchimp.com/3.0/lists/0ea3fc1a57"  //url with list id
  const options = {
    method: "POST",
    auth: "rushi:3e10820d0e1dbb71e07406bbbc0919a1-us6"
  }
  const request = https.request(url, options, function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+ "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

request.write(jsonData);
  request.end();

});


app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){//to run server on local host as well as on heroku host
  console.log("app is started at port no 3000");
})
