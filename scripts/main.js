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

/**
 * Saves a new post to the Firebase DB.
 */
// Register Submittal
function writeNewPost(firstName, lastName, dob, cell, email, location, time, date, title, description) {
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
    description, description
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/register/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
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
  updates['/volunteer/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

/**
 * Creates a post element.
 */
function createPostElement(postId, title, text, author) {
  var uid = firebase.auth().currentUser.uid;

  var html =
      '<div class="post mdl-cell mdl-cell--12-col ' +
                  'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
        '<div class="mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<div class="header">' +
            '<div>' +
              '<div class="avatar"></div>' +
              '<div class="username mdl-color-text--black"></div>' +
            '</div>' +
          '</div>' +
          '<span class="star">' +
            '<div class="not-starred material-icons">star_border</div>' +
            '<div class="starred material-icons">star</div>' +
            '<div class="star-count">0</div>' +
          '</span>' +
          '<div class="text"></div>' +
          '<div class="comments-container"></div>' +
          '<form class="add-comment" action="#">' +
            '<div class="mdl-textfield mdl-js-textfield">' +
              '<input class="mdl-textfield__input new-comment" type="text">' +
              '<label class="mdl-textfield__label">Comment...</label>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;
  componentHandler.upgradeElements(postElement.getElementsByClassName('mdl-textfield')[0]);

  var addCommentForm = postElement.getElementsByClassName('add-comment')[0];
  var commentInput = postElement.getElementsByClassName('new-comment')[0];
  var star = postElement.getElementsByClassName('starred')[0];
  var unStar = postElement.getElementsByClassName('not-starred')[0];

  // Set values.
  postElement.getElementsByClassName('text')[0].innerText = text;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;
  postElement.getElementsByClassName('username')[0].innerText = author;

  return postElement;
}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
  // [START my_top_posts_query]
  var myUserId = firebase.auth().currentUser.uid;
  var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId).orderByChild('starCount');
  // [END my_top_posts_query]
  // [START recent_posts_query]
  var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
  // [END recent_posts_query]
  var userPostsRef = firebase.database().ref('user-posts/' + myUserId);

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
          createPostElement(data.key, data.val().title, data.val().body, data.val().author),
          containerElement.firstChild);
    });
  };

  fetchPosts(topUserPostsRef, topUserPostsSection);
  fetchPosts(recentPostsRef, recentPostsSection);
  fetchPosts(userPostsRef, userPostsSection);
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
        writeNewPost(fNameRegister.value, lNameRegister.value, dobRegister.value, cellRegister.value, emailRegister.value, locationRegister.value, timeRegister.value, dateRegister.value, titleRegister.value, descriptionRegister.value).then(function() {
              console.log("Submitted Register");
            });
        // [END_EXCLUDE]
    };
  }
}, false);
