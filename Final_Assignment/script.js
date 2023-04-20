"use strict";

const url = "http://restapi.adequateshop.com/api/Tourist";

var switches = 0;

// Signing Up User or Admin
function signupfunc() {
  let x = document.forms["signUpForm"]["signUpEmail"].value;
  if (x == "") {
    return false;
  }
  x = document.forms["signUpForm"]["signUpPassword"].value;
  if (x == "") {
    return false;
  }
  x = document.forms["signUpForm"]["confirmPassword"].value;
  if (x == "") {
    return false;
  }
  var radios = document.getElementsByName("userRole");
  var formValid = false;

  var i = 0;
  while (!formValid && i < radios.length) {
    if (radios[i].checked) formValid = true;
    i++;
  }
  if (!formValid) {
    alert("Must check some option!");
    return false;
  }

  event.preventDefault();
  var email = document.getElementById("signUpEmail").value;
  var password = document.getElementById("signUpPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  const radioButtons = document.querySelectorAll('input[name="userRole"]');
  let userRole;

  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      userRole = radioButton.value;
      break;
    }
  }
  console.log(userRole);
  if (password === confirmPassword) {
    if (userRole === "Admin") {
      localStorage.setItem("AdminEmail", email);
      localStorage.setItem("AdminPassword", password);
      alert("Welcome to our website.Thanks for signing up Admin");
    } else {
      localStorage.setItem("UserEmail", email);
      localStorage.setItem("UserPassword", password);
      alert("Welcome to our website.Thanks for signing up user");
    }
  } else {
    alert(
      "Please enter the same password in password and cofirm password fields."
    );
  }
  event.preventDefault();
}

// Signing In User or Admin
function signinfunc() {
  let x = document.forms["signInForm"]["signInEmail"].value;
  if (x == "") {
    return false;
  }
  x = document.forms["signInForm"]["signInPassword"].value;
  if (x == "") {
    return false;
  }

  event.preventDefault();
  var email = document.getElementById("signInEmail").value;
  var password = document.getElementById("signInPassword").value;
  var adminEmail = localStorage.getItem("AdminEmail");
  var userEmail = localStorage.getItem("UserEmail");
  var adminPassword = localStorage.getItem("AdminPassword");
  var userPassword = localStorage.getItem("UserPassword");
  if (email === adminEmail) {
    if (password === adminPassword) {
      alert("Welcome to our website admin.");
      localStorage.setItem("user", "Admin");
      window.location = "touristPage.html";
    } else {
      alert("Your password didn't matched. Please enter the right password.");
    }
  } else if (email === userEmail) {
    if (password === userPassword) {
      alert("Welcome to our website user.");
      localStorage.setItem("user", "User");
      window.location = "touristPage.html";
    } else {
      alert("Your password didn't matched. Please enter the right password.");
    }
  } else {
    alert("Please enter a valid email.");
  }
  event.preventDefault();
}

// Show Tourist Table
function showData() {
  event.preventDefault();

  var response = fetch(url);
  var jsonData;
  response
    .then((tourist) => {
      tourist.json();
      console.log("hllo");
    })
    .then((tourist) => {
      jsonData = tourist.data;
      console.log(jsonData);

      // Creating Table from JSON
      document.getElementById("container2").innerHTML = "";
      let container = document.getElementById("container2");
      let table = document.createElement("table");
      let cols = Object.keys(jsonData[0]);
      let thead = document.createElement("thead");
      let tr = document.createElement("tr");
      cols.forEach((item) => {
        let th = document.createElement("th");
        th.innerText = item;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.append(tr);
      jsonData.forEach((item) => {
        let tr = document.createElement("tr");
        let vals = Object.values(item);
        vals.forEach((elem) => {
          let td = document.createElement("td");
          td.innerText = elem;
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
      container.appendChild(table);

      // Getting the table element

      var tables = document.getElementsByTagName("table");
      console.log(tables);
      tables[0].setAttribute("id", "myTable");

      var tablehead = document.getElementsByTagName("th");
      console.log(tablehead);
      tablehead[0].setAttribute("id", "touristId");

      var el = document.getElementById("touristId");
      if (el) {
        el.addEventListener("click", () => {
          if (switches % 2 === 0) {
            // Ascending Order Sorting
            console.log("Fireed");
            var table, rows, switching, i, x, y, shouldSwitch;
            table = document.getElementById("myTable");
            switching = true;

            while (switching) {
              switching = false;
              rows = table.rows;

              for (i = 1; i < rows.length - 1; i++) {
                shouldSwitch = false;

                x = rows[i].getElementsByTagName("TD")[0];
                y = rows[i + 1].getElementsByTagName("TD")[0];

                if (Number(x.innerHTML) > Number(y.innerHTML)) {
                  shouldSwitch = true;
                  break;
                }
              }
              if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
              }
            }
            switches++;
          } else {
            // Descending Order Sorting
            console.log("Fireed");
            var table, rows, switching, i, x, y, shouldSwitch;
            table = document.getElementById("myTable");
            switching = true;

            while (switching) {
              switching = false;
              rows = table.rows;

              for (i = 1; i < rows.length - 1; i++) {
                shouldSwitch = false;

                x = rows[i].getElementsByTagName("TD")[0];
                y = rows[i + 1].getElementsByTagName("TD")[0];

                if (Number(x.innerHTML) < Number(y.innerHTML)) {
                  shouldSwitch = true;
                  break;
                }
              }
              if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
              }
            }
            switches++;
          }
        });
      } else {
        console.log("EventListener not added.");
      }
    })
    .catch((error) => {
      alert(error);
    });
  event.preventDefault();
}

// Searching and Highlighting the Tourist
function highlightData() {
  event.preventDefault();

  var response = fetch(url);
  var jsonData;
  response
    .then((tourist) => tourist.json())
    .then((tourist) => {
      jsonData = tourist.data;
      console.log(jsonData);

      var touristId = document.getElementById("searchTouristText");
      console.log(touristId);

      if (touristId) {
        touristId = Number(touristId.value);
        console.log(touristId);

        // Ascending Order Sorting
        var table,
          rows,
          row,
          i,
          el,
          found = -1;
        table = document.getElementById("myTable");
        rows = table.rows;

        for (i = 1; i < rows.length; i++) {
          el = rows[i].getElementsByTagName("td")[0];

          if (Number(el.innerHTML) === touristId) {
            found = i;
            break;
          }
        }
        if (found !== -1) {
          for (i = 1; i < rows.length; i++) {
            if (i === found) {
              row = document.getElementsByTagName("tr")[found];
              row.style.backgroundColor = "yellow";
              console.log(row);
              console.log(found);
            } else {
              row = document.getElementsByTagName("tr")[i];
              row.style.backgroundColor = "white";
              console.log(row);
              console.log(found);
            }
          }
        } else {
          alert("Tourist not found");
        }
      } else {
        console.log("EventListener not added.");
      }
    })
    .catch((error) => {
      alert(error);
    });
  event.preventDefault();
}

// Adding data to the Database using Fetch API(PUT Method)
function addData() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var location = document.getElementById("location").value;

  fetch(url, {
    method: "POST",

    body: JSON.stringify({
      tourist_name: name,
      tourist_email: email,
      tourist_location: location,
    }),

    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((error) => {
      alert(error);
    });
}

// Updating data to the Database using Fetch API(PUT Method)
function updateData() {
  event.preventDefault();

  var id = Number(document.getElementById("id").value);
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var location = document.getElementById("location").value;

  fetch(url + id, {
    method: "PUT",

    body: JSON.stringify({
      tourist_name: name,
      tourist_email: email,
      tourist_location: location,
    }),
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((error) => {
      alert(error);
    });

  event.preventDefault();
}

// Deleting data from the Database using Fetch API(DELETE Method)
function deleteData() {
  event.preventDefault();

  var id = Number(document.getElementById("id").value);

  fetch(url + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((error) => {
      alert(error);
    });
  event.preventDefault();
}

// Showing the necessary data to the user depending upon its access level.
// Admin will have all the operations to perform.
// User can only perform Read operations.
function showUserAccess() {
  let user = localStorage.getItem("user");
  var displayInsertButton = document.getElementById("insertButton");
  var displayUpdateButton = document.getElementById("updateButton");
  var displayDeleteButton = document.getElementById("deleteButton");
  var displaytouristInputForm = document.getElementById("touristInputForm");
  if (user === "Admin") {
    if (displayInsertButton.classList.contains("displayNone")) {
      displayInsertButton.classList.remove("displayNone");
    }
    if (displayUpdateButton.classList.contains("displayNone")) {
      displayUpdateButton.classList.remove("displayNone");
    }
    if (displayDeleteButton.classList.contains("displayNone")) {
      displayDeleteButton.classList.remove("displayNone");
    }
    if (displaytouristInputForm.classList.contains("displayNone")) {
      displaytouristInputForm.classList.remove("displayNone");
    }
  } else {
    if (!displayInsertButton.classList.contains("displayNone")) {
      displayInsertButton.classList.add("displayNone");
    }
    if (!displayUpdateButton.classList.contains("displayNone")) {
      displayUpdateButton.classList.add("displayNone");
    }
    if (!displayDeleteButton.classList.contains("displayNone")) {
      displayDeleteButton.classList.add("displayNone");
    }
    if (!displaytouristInputForm.classList.contains("displayNone")) {
      displaytouristInputForm.classList.add("displayNone");
    }
  }
}
