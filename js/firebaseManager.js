export default class FirebaseManager {
    constructor() {
        var config = {
          apiKey: "AIzaSyB0o_t5IWc9HSk2BRuLy8_xY1nrRRbGjwk",
          authDomain: "phaserconnect4.firebaseapp.com",
          databaseURL: "https://phaserconnect4.firebaseio.com",
          projectId: "phaserconnect4",
          storageBucket: "phaserconnect4.appspot.com",
          messagingSenderId: "1044201951145"
        };

        // Initialize the default app
        this.defaultApp = firebase.initializeApp(config);

        console.log(this.defaultApp.name);  // "[DEFAULT]"

        // You can retrieve services via the defaultApp variable...
        this.db = this.defaultApp.database();

        //console.log(this.helloWorld());
    }

    helloWorld() {
        // A post entry.
        var data = {
            myString: "Hello, World!"
        };

        // Get a key for a new Post.
        var newKey = this.db.ref().child('helloworld').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/helloworld/' + newKey] = data;
        //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

        return this.db.ref().update(updates);
    }

    writeSlots(slots) {
        this.db.ref("game/slots").set(slots);
    }

    setCurrentPlayer(player) {
        this.db.ref("game/currentPlayer").set(player);
    }

    getNextPlayer(callback) {
        var ref = this.db.ref("game/nextPlayer");
        ref.transaction(function(nextPlayer) {
            callback(nextPlayer);
            if (nextPlayer == "red") {
                nextPlayer = "blue";
            } else {
                nextPlayer = "red";
            }
            return nextPlayer;
        });
    }

    isPlayerAssigned(color, callback) {
        var ref = this.db.ref("game/" + color);
        ref.transaction(function(isAssigned) {
            if (callback(isAssigned)) {
                return true;
            }
        });
        /*ref.once('value').then(function(snapshot) {

        });*/
    }
}
