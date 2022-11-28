class Note {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

}
var database = new Dexie("NoteDatabase");

// DB with a single table "notes" with primary key "id" and
// indexes on properties "title" and "body"
// Auto-incrememnted primary key (id)
database.version(1).stores({
  notes: `++id, title, body, image_path`,
});

// Add existing values "notes" into the database (for testing purposes)
// database.notes.bulkPut([
//   {title: "TODO LIST", body: "1. Feed the cats"},
//   {title: "Favorite Food", body: "Blueberries, strawberries, cherries"}
// ]).then(() => {
//   return database.notes.where("id").between(1, 6).toArray();
// }).then(notes => {
//   console.log(notes.map(note => note.title));
// }).catch(error => {
//   alert("Error: " + error);
// })

// Add a note
function addNote(data) {
  database.notes.add(data)
    .then(result => console.log(result))
    .catch(error => console.log(error));
}

// Print an array of objects (notes)
database.notes.toArray()
  .then(arr => console.log(arr))

// Print every object (note) from an array
database.notes.toArray()
  .then(arr => arr.forEach(item => console.log(item)));

// Update every note from the notes database
function updateNote(data) {
  database.notes.toArray()
    .then(arr => arr.forEach(record => {
      if (record.id == data.id) {  // Find matching id, in order to make changes
        database.notes.update(record.id, { "title": data.title, "body": data.body, "image_path": data.image_path })
          .then(function(updated) {  // Check if the note is updated or not
            if (updated) {
              console.log("It is updated")
            } else {
              console.log("It is NOT updated")
            }
          })
      }
    }))
}

// Display all the notes into the DOM
const displayNotes = () => {
  database.notes.toArray()
    .then(arr => arr.forEach(record => {
      document.body.append(JSON.stringify(record))
    }))
}

// Delete a note from the database
// Assume that the id exists in the database
function deleteNote(data) {
  database.notes.delete(data.id);
}

// Search/Filter notes from the database based on title
function filterNote(data) {
  database.notes.where("title").equalsIgnoreCase(data.title).toArray()
    .then(arr => console.log(arr));
}

// Populate the records into the Node List screen
database.notes.toArray()
  .then(arr => arr.forEach(record => {

    // Create a new note item (creating the HTML elements)
    let noteItem = document.createElement("li");
    noteItem.setAttribute("class", "mdc-list-item note-list-item")
    noteItem.style.display = "block";
    console.log(noteItem);

    let noteRipple = document.createElement("span");
    noteRipple.setAttribute("class", "mdc-list-item__ripple")
    noteItem.appendChild(noteRipple)

    let noteText = document.createElement("span");
    noteText.setAttribute("class", "mdc-list-item__text")

    let noteTitleText = document.createElement("span")
    noteTitleText.setAttribute("class", "mdc-list-item__primary-text")

    let noteBodyText = document.createElement("span")
    noteBodyText.setAttribute("class", "mdc-list-item__secondary-text")

    let noteImage = document.createElement("img")
    noteImage.setAttribute("class", "note-image")

    let space = document.createElement("br")

    noteItem.appendChild(noteImage)
    noteItem.appendChild(space)
    noteText.appendChild(noteTitleText)
    noteText.appendChild(noteBodyText)
    noteItem.appendChild(noteText)
    

    // Insert the title and body info
    noteItem.querySelector(".mdc-list-item__primary-text").innerHTML = record.title;
    noteItem.querySelector(".mdc-list-item__secondary-text").innerHTML = record.body;
    noteItem.querySelector(".note-image").src = record.image_path;

    // Append the note item to the list screen
    document.querySelector(".mdc-list.mdc-list--two-line").appendChild(noteItem);
    console.log(noteItem);

    // TEST: AddEventListener (Change to the Note Entry)
    noteItem.addEventListener("click", (event) => {

      // Switch screen to show the note
      console.log("Pls Work" + record.id)
      document.querySelectorAll("div.screen").forEach(screen => screen.style.display = "none")
      document.querySelector("#div3").style.display = "block";

      let noteTitle = document.querySelector(".note-entry-title");
      noteTitle.innerText = record.title;
      let noteBody = document.querySelector(".note-entry-description")
      noteBody.innerText = record.body;
      let noteImage = document.querySelector(".note-entry-image");
      noteImage.src = record.image_path;

      document.querySelector(".border").setAttribute("id", "noteNum" + record.id)
    })
  })
  )


// TODO: When the user create a note, the note will be added to the list
let submitBtn = document.querySelector("#submit_note")

submitBtn.addEventListener("click", (event) => {
  // Get the title and body text from the user inputs
  let title_entry = document.querySelector(".title-input");
  let body_entry = document.querySelector(".body-input");
  let image_entry = document.querySelector(".image-input");

  // Check if there is an input for the title text
  if (title_entry.value == "") {
    alert("Missing title; enter a title")
  } else {

    // Check if there is an image link
    // If not, set a default image
    if (image_entry.value == "") {
      image_entry.value = "https://th.bing.com/th/id/R.1a12b4c6a85c3d3d0356b8b0982e3038?rik=%2bN8VUyxPhKxwsA&riu=http%3a%2f%2fvignette3.wikia.nocookie.net%2flego%2fimages%2fa%2fac%2fNo-Image-Basic.png%2frevision%2flatest%3fcb%3d20130819001030&ehk=4LPMn2YupbS2wKmWBvjF5%2bFz434RztzcY3x7Pg99GBI%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"
    }

    // Create a new note item (creating the HTML elements)
    let noteItem = document.createElement("li");
    noteItem.setAttribute("class", "mdc-list-item note-list-item")
    noteItem.style.display = "block";
    console.log(noteItem);  // testing

    let noteRipple = document.createElement("span");
    noteRipple.setAttribute("class", "mdc-list-item__ripple")
    noteItem.appendChild(noteRipple)

    let noteText = document.createElement("span");
    noteText.setAttribute("class", "mdc-list-item__text")

    let noteTitleText = document.createElement("span")
    noteTitleText.setAttribute("class", "mdc-list-item__primary-text")

    let noteBodyText = document.createElement("span")
    noteBodyText.setAttribute("class", "mdc-list-item__secondary-text")

    let noteImage = document.createElement("img")
    noteImage.setAttribute("class", "note-image")

    // Save the new entry to the database
    var newNote = new Note;
    newNote.title = title_entry.value;
    newNote.body = body_entry.value;
    newNote.image_path = image_entry.value;

    // Get the id number
    let noteNum = 0;
    
    // Add the new entry to the database
    database.notes.add(newNote)
    .then(result => {
      console.log("This is" + result)
      noteNum = result;
    })
    .catch(error => console.log(error));

    let space = document.createElement("br")
    
    // Append the remaining elements to the note_item HTML
    noteItem.appendChild(noteImage)
    noteItem.appendChild(space)
    noteText.appendChild(noteTitleText)
    noteText.appendChild(noteBodyText)
    noteItem.appendChild(noteText)

    // Insert the title and body text info to note_item HTML to be displayed on screen
    noteItem.querySelector(".mdc-list-item__primary-text").innerHTML = title_entry.value;
    noteItem.querySelector(".mdc-list-item__secondary-text").innerHTML = body_entry.value;
    noteItem.querySelector(".note-image").src = image_entry.value;

    document.querySelector(".mdc-list.mdc-list--two-line").appendChild(noteItem);
    console.log(noteItem);

    // TEST: AddEventListener (Change to the Note Entry)
    noteItem.addEventListener("click", (event) => {
      document.querySelectorAll("div.screen").forEach(screen => screen.style.display = "none")
      document.querySelector("#div3").style.display = "block";

      document.querySelector(".note-entry-title").innerText = title_entry.value;
      document.querySelector(".note-entry-description").innerText = body_entry.value;
      document.querySelector(".note-entry-image").src = image_entry.value;

      document.querySelector(".border").setAttribute("id", "noteNum" + noteNum)
    })

    // Switch to the Note List screen
    document.querySelector("#div2").style.display = "none";
    document.querySelector("#div1").style.display = "block";

  }
})

// TODO: When the user hit edit, will direct to the edit page (use the Edit Page)
let editButton = document.querySelector("#edit_note")

editButton.addEventListener("click", (event) => {
  let noteTitle = document.querySelector(".note-entry-title").innerText;
  let noteBody = document.querySelector(".note-entry-description").innerText;
  let noteImage = document.querySelector(".note-entry-image").src;
  console.log(noteImage)

  if (noteTitle != "") {
    // Switch screens to edit the note
    document.querySelector("#div3").style.display = "none";
    document.querySelector("#div4").style.display = "block";

    let noteNum = document.querySelector(".border").getAttribute("id")
  console.log(noteNum.substring(7))

    let updateTitle = document.querySelector(".title-update-input");
    let updateBody = document.querySelector(".body-update-input");
    let updateImage = document.querySelector(".image-update-input")

    updateTitle.value = noteTitle;
    updateBody.value = noteBody;
    updateImage.value = noteImage;

    let updateButton = document.querySelector("#update_note")
    updateButton.addEventListener("click", (event) => {
      // Edit the new entry to the database
      var newNote = new Note;
      newNote.title = updateTitle.value;
      newNote.body = updateBody.value;
      newNote.image_path = updateImage.value;
      newNote.id = noteNum.substring(7);
      
      updateNote(newNote);

      // Switch screen
      document.querySelector("#div4").style.display = "none";
      document.querySelector("#div1").style.display = "block";

      // TODO(?): Show the edit changes w/o having to refresh the page
      alert("The note have been updated. Refresh to see the change.")
    })

  } else {
    alert("Need to select a note from the list to edit.")
  }

  // Clear the search bar input
  document.querySelector("#searchbar").value = "";
  let noteList = document.querySelectorAll(".note-list-item")
  noteList.forEach(note => {
    note.style.display="list-item"
  })
  
})


// Searchbar function where it filters the notes
function searchNoteTitles() {
  let input = document.querySelector("#searchbar").value
  input = input.toLowerCase();

  let x = document.querySelectorAll(".note-list-item")
  console.log(x)

  for (i = 0; i < x.length; i++) {
    if (!x[i].innerText.toLowerCase().includes(input)) {
      x[i].style.display="none";
    } else {
      x[i].style.display="list-item"
    }
    
  }
  
}

