'use strict';
// Shortcuts to DOM Elements - Register.
var fNameRegister = document.getElementById('register-fname');
var lNameRegister = document.getElementById('register-lname');
var dobRegister = document.getElementById('register-dob');
var cellRegister = document.getElementById('register-cell');
var emailRegister = document.getElementById('register-email');
var locationRegister = document.getElementById('register-location');
var timeRegister = document.getElementById('register-time');
var dateRegister = document.getElementById('register-date');
var titleRegister = document.getElementById('register-title');
var descriptionRegister = document.getElementById('register-description');
var postButtonRegister = document.getElementById('post-button-register');


// Shortcuts to DOM Elements - Volunteer.
var fNameVolunteer = document.getElementById('volunteer-fname');
var lNameVolunteer = document.getElementById('volunteer-lname');
var dobVolunteer = document.getElementById('volunteer-dob');
var cellVolunteer = document.getElementById('volunteer-cell');
var emailVolunteer = document.getElementById('volunteer-email');
var addressVolunteer = document.getElementById('volunteer-address');
var cityVolunteer = document.getElementById('volunteer-city');
var stateVolunteer = document.getElementById('volunteer-state');
var positionVolunteer = document.getElementById('volunteer-position');
var checkboxVolunteer = document.getElementById('volunteer-checkbox');
var postButtonVolunteer = document.getElementById('post-button-volunteer');

var myPostsSection = document.getElementById('my-posts-list');

/**
 * Saves a new post to the Firebase DB.
 */
// Register Submittal
function writeNewPost(firstName, lastName, dob, cell, email, location, time, date, title, description) {

  var selectedFile = document.getElementById('myfiles').files[0];
  // Firebase Paths
  var path = "images/" + firstName + "_" + lastName + "_" + selectedFile.name;
  var pathRef = storageRef.child(path)
  // Upload
  var uploadTask = pathRef.put(selectedFile);

  uploadTask.on('state_changed', function(snapshot){
  }, function(error) {
      console.log("Error uploading file");
  }, function() {
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log("File uploaded successfully");
      // A post entry.
      var postData = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        cell: cell,
        email: email,
        location: location,
        time: time,
        date: date,
        title: title,
        description: description,
        imgURL: downloadURL
      };

      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('posts').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/events/' + newPostKey] = postData;

      console.log("Submitted Register");
      window.location.reload();

      return firebase.database().ref().update(updates);
  });


}

// Volunteer Submittal
function writeNewPostVolunteer(firstName, lastName, dob, cell, email, address, city, state, position) {
  // A post entry.
  var postData = {
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    cell: cell,
    email: email,
    address: address,
    city: city,
    state: state,
    position: position,
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/volunteers/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

/**
 * Creates an event element.
 */
function createPostElement(title, date, time, location, description, imageURL) {

  var html =
      '<div class="event">' +
      '<img src= "'+imageURL+'"width="300" >' +
      '<h3 class="title"></h3>' +
      '<h4 class="date"></h4>' +
      '<h4>at</h4>' +
      '<h4 class="time"></h4>' +
      '<h4 class="location"></h4>' +
      '<p class="description"></p>' +
      '<a data-toggle="tab" href="#menu2"><button type="button">Volunteer</button></a>' +
      '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;

  // Set values.
  postElement.getElementsByClassName('title')[0].innerText = title;
  postElement.getElementsByClassName('date')[0].innerText = date;
  postElement.getElementsByClassName('time')[0].innerText = time;
  postElement.getElementsByClassName('location')[0].innerText = "Located at " + location;
  postElement.getElementsByClassName('description')[0].innerText = description;

  return postElement;
}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
  var myPostsRef = firebase.database().ref('events/');

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
          createPostElement(data.val().title, data.val().date, data.val().time, data.val().location, data.val().description, data.val().imgURL),
          containerElement.firstChild);
    });
  };

  fetchPosts(myPostsRef, myPostsSection);
}

// Bindings on load.
window.addEventListener('load', function() {

  // Volunteer Section
  postButtonVolunteer.onclick = function(e) {
    console.log("Volunteer Button clicked");
    e.preventDefault();
    if (fNameVolunteer.value && lNameVolunteer.value && checkboxVolunteer.checked) {
        // [START_EXCLUDE]
        writeNewPostVolunteer(fNameVolunteer.value, lNameVolunteer.value, dobVolunteer.value, cellVolunteer.value, emailVolunteer.value, addressVolunteer.value, cityVolunteer.value, stateVolunteer.value, positionVolunteer.value).then(function() {
              console.log("Submitted Volunteer");
              location.reload();
            });
        // [END_EXCLUDE]
    };
  }

  // Register Section
  postButtonRegister.onclick = function(e) {
    console.log("Register Button clicked");
    e.preventDefault();
    if (fNameRegister.value && lNameRegister.value) {
        // [START_EXCLUDE]
        writeNewPost(fNameRegister.value, lNameRegister.value, dobRegister.value, cellRegister.value, emailRegister.value, locationRegister.value, timeRegister.value, dateRegister.value, titleRegister.value, descriptionRegister.value)
        // [END_EXCLUDE]
    };
  }

  // Listen for auth state changes
    startDatabaseQueries();
    myPostsSection.style.display = 'block';

}, false);
