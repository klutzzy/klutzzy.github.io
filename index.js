// index.js
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
const path = require('path');
dates = []
responst = ""
bearer = ""
data = ""
ws = null

ids = []
combinedData = ""
map = null
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.use(express.static(__dirname + '/public'));
//  session management
app.use(session({
  secret: 'ironman',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600000,
  }
}));

function checkString(string) {
  const pattern = /^[A-Za-z]{3}\d{4}$/;
  return pattern.test(string);
}


function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/login');
}

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/tutorial', (req, res) => {
  res.sendFile(__dirname + '/tutorial.html');
});

// Handle login request
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === '') {  //Z5@hT_L
    req.session.isAuthenticated = true;
    req.session.isAdmin = false;
    res.json({ success: true });
  } else if (password === 'L%k_pR') {
    req.session.isAuthenticated = true;
    req.session.isAdmin = true;
    res.json({ success: true, admin: true });
  } else {
    res.json({ success: false });
  }
});


app.get('/schema.html', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/schema.html');
});

app.get('/admin.html', isAdmin, (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});

// Handle the logout request
app.get('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.isAdmin = false;
  res.json({ success: true });
});


app.post('/load', async (req, res) => {
  console.log(req.session.id)
  const emails = [];
  const loads = [];
  const datess = [];
  const fileContent = fs.readFileSync('file.txt', 'utf8');
  const lines = fileContent.split('\n');
  lines.forEach((item, count)  => {
    if(item.includes("@edu.kunskapsskolan.se")) {
      emails.push(item);
      datess.push(lines[count-1])
      let newLines = lines.slice(count + 1, count + 18);
      let newFileContent = newLines.join('\n');
      loads.push(newFileContent)
    }
  });

  let combinedDataaa = { emails, loads, datess };
  res.send(JSON.stringify(combinedDataaa));
  
})


app.post('/submit-api', async (req, res) => {
  try {
    dates = []
    ids = []
    apiData = req.body.apiData;
    loadorno = req.body.tof;

    console.log(apiData)

    const commaIndex = apiData.indexOf(',');
    url = apiData.slice(0, commaIndex);
    url = url.slice(7, -1);
    
    if(loadorno == false) {
      emailSection = url.slice(url.indexOf('%40') - 7, url.indexOf('%40'));
      email = emailSection + "@edu.kunskapsskolan.se";

      if (!checkString(emailSection)){
        status = "Invalid email!"
        res.send({ status });
        return;
      }
        


      const fileContent = fs.readFileSync('file.txt', 'utf8');
      const linesToRemove = 17;
      const lines = fileContent.split('\n');
      const index = lines.findIndex(line => line.includes(email));
      
      if (index !== -1) {
        
        lines.splice(index + 1, linesToRemove, apiData);

        const timeElapsed = Date.now();
        today = new Date(timeElapsed);
        today.setHours(today.getHours() + 1);
        today = today.toUTCString();

        today = today.slice(0, -4);
        

        lines.splice(index - 1, 1, today)



        newContent = lines.join("\n")
        fs.writeFile("file.txt", newContent, (err) => {
          if (err) {
            throw err;
            console.log("Data has been written to file successfully.");
          }
        });
        // 
      } else if (index == -1) {
        
        const timeElapsed = Date.now();
        today = new Date(timeElapsed);
        today.setHours(today.getHours() + 1);
        today = today.toUTCString();

        today = today.slice(0, -4);
        // timestamp in milliseconds


        fs.appendFile('file.txt', "\n" + today + "\n" + email + "\n" + apiData + "\n-------------------------------", (err) => {
          if (err) {
            throw err;
            console.log("Data has been written to file successfully.");
          }
        });
      }
    }

    headerrr = apiData.slice(commaIndex + 1);
    headerrr = headerrr.slice(0, -2);
    
    try {
      headerrr = JSON.parse(headerrr);
      bearer = headerrr.headers.authorization;
    } catch {

    }

    try {
      response = await fetch(url, headerrr);
      data = await response.json();

      for (const item of data) {
        ws = item.ws + "," + item.id;
        ids.push(ws);
        const dateTime = item.dateTime;
        const timeZone = 'Europe/Bucharest'; // GMT+2

        const date = new Date(dateTime);
        date.setMinutes(date.getMinutes() - 60);
        const options = { weekday: 'long', timeZone, hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' };



        formattedDate = date.toLocaleString('en-US', options);
        formattedDate = formattedDate.slice(0, -5);

        dates.push(formattedDate);
      


      }
      const status = "success"
      combinedData = { dates, ids, bearer, status };
      res.send(JSON.stringify(combinedData));
    } catch {
      res.send("ERROR");
    }

    // Wait for the fetch to complete
    // Wait for JSON parsing


    // handle the submitted API data



  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
