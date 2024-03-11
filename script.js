let schemaaa = "";

async function submitAPI() {
    dates = []
    ids = []
    apiData = document.getElementById("apiTextArea").value
    
    console.log(apiData)
    
    const commaIndex = apiData.indexOf(',');
    url = apiData.slice(0, commaIndex);
    url = url.slice(7, -1);
    emailSection = url.slice(url.indexOf('%40') - 7, url.indexOf('%40'));
    if (!checkString(emailSection)){
        alert("Invalid!");
        return;
    }
    
    headerrr = apiData.slice(commaIndex + 1);
    headerrr = headerrr.slice(0, -2);
    headerrr = JSON.parse(headerrr);
    bearer = headerrr.headers.authorization;
    
    
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

    ws = ids;
    
    let itemList = document.getElementById("itemList");
        itemList.innerHTML = "";
        itemList = document.getElementById("itemList2");
        itemList.innerHTML = "";
        itemList = document.getElementById("itemList3");
        itemList.innerHTML = "";
        itemList = document.getElementById("itemList4");
        itemList.innerHTML = "";
        itemList = document.getElementById("itemList5");
        itemList.innerHTML = "";

    dates.forEach((item, count) => {


          const li = document.createElement("li");
          if(item.includes("Monday")) {
            itemList = document.getElementById("itemList");
            let newItem = item.slice(7,-1)
            li.textContent = `${newItem} [REMOVE]`;
          } else if(item.includes("Tuesday")) {
            itemList = document.getElementById("itemList2");
            let newItem = item.slice(9,-1)
            li.textContent = `${newItem} [REMOVE]`;
          } else if(item.includes("Wednesday")) {
            itemList = document.getElementById("itemList3");
            let newItem = item.slice(11,-1)
            li.textContent = `${newItem} [REMOVE]`;
          } else if(item.includes("Thursday")) {
            itemList = document.getElementById("itemList4");
            let newItem = item.slice(10,-1)
            li.textContent = `${newItem} [REMOVE]`;
          } else if(item.includes("Friday")) {
            itemList = document.getElementById("itemList5");
            let newItem = item.slice(8,-1)
            li.textContent = `${newItem} [REMOVE]`;
          }


          itemList.appendChild(li);

          function handleItemClick(itemCount) {
            li.addEventListener("click", async function () {
              console.log("Removing from itemList:", itemList);
              console.log("Removing item:", li);
              if (document.getElementById("itemList").contains(li)) {
                document.getElementById("itemList").removeChild(li);
              } else if (document.getElementById("itemList2").contains(li)) {
                document.getElementById("itemList2").removeChild(li);
              } else if (document.getElementById("itemList3").contains(li)) {
                document.getElementById("itemList3").removeChild(li);
              } else if (document.getElementById("itemList4").contains(li)) {
                document.getElementById("itemList4").removeChild(li);
              } else if (document.getElementById("itemList5").contains(li)) {
                document.getElementById("itemList5").removeChild(li);
              }
              console.log(itemCount)
              alert("You clicked item " + ws[itemCount]);

              erik = ws[itemCount].split(",");
              console.log("erik1: ", erik[0], " erik2: ", erik[1])
              const hello = {
                url: "https://app-kedbackend-prod-swe-02.azurewebsites.net/api/batch?clientIdentity=6b14119f-3bf2-4d23-8c49-c4be156f0e13&flags=modtrack",
                method: "POST",
                headers: {
                  accept: "application/json",
                  "accept-language": "en,sv;q=0.9,ko;q=0.8",
                  authorization: bearer,
                  "content-type": "application/json",
                  "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Chrome OS\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "cross-site",
                  Referer: "https://ks.kunskapsporten.se/",
                  "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                body: JSON.stringify([
                  { "op": "unlink", "sourceTable": "calendarEvents", "sourceId": erik[0], "targetId": erik[1], "label": "workshopBookings" },
                  { "op": "delete", "table": "workshopBookings", "id": erik[1] }
                ])
              }
              await fetch(hello.url, hello);

            });
          }
          handleItemClick(count);
        });
}


function checkString(string) {
  const pattern = /^[A-Za-z]{3}\d{4}$/;
  return pattern.test(string);
}

// script.js

// Assuming choices.json contains an array of choices
// script.js

document.addEventListener('DOMContentLoaded', function () {
  loadChoices();
});

const choicesFile = 'choices.json';
const inputFile = 'input.json';

function loadChoices() {
  var url = new URL('https://classy-clever-package.glitch.me/schema')
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      schemaaa = data
      document.getElementById("lektion").innerHTML = schema.currentWeek
    });
  fetch(choicesFile)
    .then(response => response.json())
    .then(choices => {
      const dropdownOptions = document.getElementById('dropdownOptions');
      choices.forEach(choice => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.textContent = choice;
        option.onclick = () => selectOption(choice);
        dropdownOptions.appendChild(option);
      });
    })
    .catch(error => console.error('Error loading choices:', error));
}

function toggleDropdown() {
  const dropdownOptions = document.getElementById('dropdownOptions');
  dropdownOptions.style.display = dropdownOptions.style.display === 'none' ? 'block' : 'none';
}

function selectOption(option) {
  const dropdownSelect = document.querySelector('.dropdown-select');
  dropdownSelect.innerText = option;
  toggleDropdown();
  loadSchema(option);
}

function filterOptions() {
  const searchInput = document.querySelector('.search-input');
  const options = document.querySelectorAll('.dropdown-option');
  const filter = searchInput.value.toLowerCase();

  options.forEach(option => {
    const optionText = option.innerText.toLowerCase();
    option.style.display = optionText.includes(filter) ? 'block' : 'none';
  });
}

function loadSchema(option) {
    let itemList = document.getElementById("itemList");
     itemList.innerHTML = "";
     itemList = document.getElementById("itemList2");
     itemList.innerHTML = "";
     itemList = document.getElementById("itemList3");
     itemList.innerHTML = "";
     itemList = document.getElementById("itemList4");
     itemList.innerHTML = "";
     itemList = document.getElementById("itemList5");
     itemList.innerHTML = "";
      const jsonData = schemaaa

      let lektioner = [];
      let targetStudent = option;

      jsonData.forEach((item, count) => {
        for (const workshop of item.workshopBookings) {
          if (workshop.studentDisplayName === targetStudent) {
            const epochTimestamp = item.dateTime;
            const dateObject = new Date(epochTimestamp);

            const timeZone = 'Europe/Stockholm';
            const date = new Date(dateObject);

            const options = { weekday: 'long', timeZone, hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' };
            formattedDate = date.toLocaleString('en-US', options);
            formattedDate = formattedDate.slice(0, -5);

            lektioner.push([item.name, item.location, formattedDate]);
          }
        }
      });
      lektioner.forEach((itemm,count) => {
          const li = document.createElement("li");
          let ws = itemm[0]
          let rum = itemm[1]
          let date = itemm[2]
          if(date.includes("Monday")) {
            itemList = document.getElementById("itemList");
            date = date.slice(7,-1)
            li.textContent = `${date} ${ws}`;
          } else if(date.includes("Tuesday")) {
            itemList = document.getElementById("itemList2");
            date = date.slice(9,-1)
            li.textContent = `${date} ${ws}`;
          } else if(date.includes("Wednesday")) {
            itemList = document.getElementById("itemList3");
            date = date.slice(11,-1)
            li.textContent = `${date} ${ws}`;
          } else if(date.includes("Thursday")) {
            itemList = document.getElementById("itemList4");
            date = date.slice(10,-1)
            li.textContent = `${date} ${ws}`;
          } else if(date.includes("Friday")) {
            itemList = document.getElementById("itemList5");
            date = date.slice(8,-1)
            li.textContent = `${date} ${ws}`;
          }


          itemList.appendChild(li);
      })

     

      console.log(lektioner);
    
}

function(submitVisare) {
   
}


