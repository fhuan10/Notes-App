<script>

    var db = new Dexie("FriendDatabase");

    // DB with single table "friends" with primary key "id" and
    // indexes on properties "name" and "age"
    db.version(2).stores({
      friends: `
        id,
        title,
        body`,
    });

    // Now add some values.
    db.friends.bulkPut([
      {id: 1, title: "Josephine", body: 21},
      {id: 2, title: "Per", body: 75},
      {id: 3, title: "Simon", body: 5},
      {id: 4, title: "Sara", body: 50, notIndexedProperty: 'foo'}
    ]).then(() => {

      return db.friends.where("body").between(0, 25).toArray();

    }).then(friends => {

      console.log("Found young friends: " +
        friends.map(friend => friend.title));

      return db.friends
        .orderBy("body")
        .reverse()
        .toArray();

    }).then(friends => {

      console.log("Friends in reverse age order: " +
        friends.map(friend => `${friend.title} ${friend.body}`));

      return db.friends.where('title').startsWith("S").keys();

    }).then(friendNames => {

      console.log("Friends on 'S': " + friendNames);

    }).catch(err => {

      alert("Ouch... " + err);

    });

    // Add notes
    //TODO: Increment the id
    const addNote = (data) => {
      newNote = {
        "id": ++data.id, "title": data.title
      }

      db.friends.add(data)
        .then(result => console.log(result))
        .catch(err => console.log(result));
    }

    // Update notes
    // Print out the array of objects
    db.friends.toArray()
      .then(arr => console.log(arr))

    // Print out every object in the array separately 
    db.friends.toArray()
      .then(arr => arr.forEach(item => console.log(item)));


    // Update every object in the friends database
    db.friends.toArray()
      .then(arr => arr.forEach(item => {
        db.friends.update(item.id, {"id": item.id, "title": "Bob", "body": 30})
          .then(function (updated) {
            if (updated) {
              console.log("Yay")
            } else {
              console.log("You messed up")
            }
          })
      }))

    // Display notes when displayNotes is called
    const displayNotes = () => {
      db.friends.toArray()
        .then(arr => arr.forEach(item => {
          document.body.append(JSON.stringify(item))  // converts to a JSON string
        }))
    }



  </script>