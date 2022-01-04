'use strict';
(function () {

  window.addEventListener('load', init);

  /**
   * This is the initialization function which would be called once the
   * window of the user loads the page. It contains the main bulk of code
   * that adds behaviour to index.html. This function is similar to the main
   * of my code, which is basically in charge of telling DOM objects what to
   * look out for in index.html.
   */
  function init() {
    let contents = qsa('.content');
    let addButton = id('add-button');
    let clearButton = id('rmv-button');
    let getImageButton = id('get-image');
    let emailForm = id('user-information');
    let viewUser = id('view-users');
    addButton.addEventListener('click', function () {
      addToList(id('my-list'));
    });
    clearButton.addEventListener('click', function () {
      clearList(id('my-list'));
    });
    getImageButton.addEventListener('click', getRoverImage);
    for (let i = 0; i < contents.length; i++) {
      contents[i].addEventListener('mouseover', function () {
        toggleStyle(contents[i], true);
      });
      contents[i].addEventListener('mouseout', function () {
        toggleStyle(contents[i], false);
      });
    }
    emailForm.addEventListener('submit', (event) => {
      event.preventDefault();
      saveUser();
    });
    viewUser.addEventListener('click', viewUsers);
  }

  /**
   * This function is responsible for viewing all users that have been
   * added to the contact on the website.
   */
  function viewUsers() {
    fetch('/getusers')
      .then(statusCheck)
      .then(resp => resp.json())
      .then((resp) => {
        id('current-users').innerHTML = '';
        for (let i = 0; i < resp['connected-members'].length; i++) {
          let ptag = gen('p');
          ptag.textContent = resp['connected-members'][i];
          id('current-users').append(ptag);
        }
      })
      .catch((err) => {
        id('current-users').innerHTML = '';
        let ptag = gen('p');
        ptag.textContent = 'Users aren\'t available ' + err;
        id('current-users').append(ptag);
      });
  }

  /**
   * This function is responsible for adding the name and email details
   * of new users into the backend.
   */
  function saveUser() {
    let params = new FormData(id('user-information'));
    params.append('username', id('username').value);
    params.append('email', id('email-address').value);
    fetch('/saveusers', { method: 'POST', body: params })
      .then(statusCheck)
      .then(resp => resp.text())
      .then((resp) => {
        id('res-msg').innerHTML = '';
        let ptag = gen('p');
        ptag.textContent = resp;
        id('res-msg').append(ptag);
      })
      .catch((err) => {
        id('res-msg').innerHTML = '';
        let ptag = gen('p');
        ptag.textContent = 'name or username not valid ' + err;
        id('res-msg').append(ptag);
      });
  }

  /**
   * This function is responsible for recording the inputs the user gave
   * and according to the inputs get information from the NASA API on mars
   * rovers.
   */
  function getRoverImage() {
    let url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/';
    let api = 'M3Mf7n0irS7O9WhMn7iMK3RGCuVrJ2rQ2mI91iYm';
    let sols = id('sols').value;
    let rover = id('rover-selection').value;
    let cameras = qsa('.cam');
    let selectedCam = 'rhaz';
    for (let i = 0; i < cameras.length; i++) {
      if (cameras[i].checked) {
        selectedCam = cameras[i].value;
      }
    }
    fetch(url + rover + '/photos?sol=' + sols + '&camera=' + selectedCam + '&api_key=' + api)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(appendImg)
      .catch(errHandler);
  }

  /**
   * Takes in a response object and checks the status of the API call
   * seeing if fetching information from the given API is successful.
   * If it is then it will return the response object if not it will
   * throw an error.
   * @param {object} resp - A response object which contains information
   *                        about the user's query.
   * @returns {object} resp - A response object which contains information
   *                          about the user's query.
   */
  async function statusCheck(resp) {
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
    return resp;
  }

  /**
   * Takes in a response object and either appends an image of the user's
   * query to the website or replaces it.
   * @param {object} resp - A response object which contains information
   *                        about the user's query
   */
  function appendImg(resp) {
    let imgContainer = id('mars-img');
    let marsImg = resp.photos[0].img_src;
    let img = gen('img');
    img.src = marsImg;
    img.classList.add('replace');
    id('err-msg').innerHTML = '';
    if (imgContainer.children.length > 0) {
      imgContainer.replaceChild(img, imgContainer.children[0]);
    } else {
      imgContainer.appendChild(img);
    }
  }

  /**
   * Takes in the thrown error and displays the original error message
   * along with a helpful message to the user
   * @param {object} err - An error that is thrown when the user incorrectly
   *                       querys an image.
   */
  function errHandler(err) {
    let p1 = gen('p');
    let p2 = gen('p');
    p1.classList.add('help-msg');
    p2.classList.add('error');
    p1.textContent = 'Image doesn\'t exist. Please choose different options';
    p2.textContent = err;
    id('mars-img').innerHTML = '';
    if (id('err-msg').children.length > 0) {
      id('err-msg').replaceChild(p1, id('err-msg').children[0]);
      id('err-msg').replaceChild(p2, id('err-msg').children[1]);
    } else {
      id('err-msg').appendChild(p1);
      id('err-msg').appendChild(p2);
    }
  }

  /**
   * Takes in an object which is basically most of the text content on my html page
   * then proceeds to add underlining and itaclization to text on the page.
   * @param {object} dom - A DOM object that is basically most text content on index.html
   * @param {Boolean} isInside - A Boolean that shows if the user is hovering over
   *                             the given DOM object.
   */
  function toggleStyle(dom, isInside) {
    if (isInside) {
      dom.classList.toggle('content-hover-in');
    } else {
      dom.classList.remove('content-hover-in');
    }
  }

  /**
   * Takes in a  in a DOM object which is the parent list of all to do list
   * items and also processes a user input to add it as a list item to the
   * to do list on html page.
   * @param {object} parentList - a DOM object which is the parent list of all to do list items
   */
  function addToList(parentList) {
    let listItem = document.createElement('li');
    let text = id('todo-input').value;
    listItem.textContent = text;
    listItem.classList.add('todo-list-content');
    if (text !== '') {
      parentList.appendChild(listItem);
    }
  }

  /**
   * Remove all list items on the page
   * @param {object} parentList - a DOM object which is the parent list of all to do list items
   */
  function clearList(parentList) {
    parentList.innerHTML = '';
  }

  /**
   * Takes in a string as a parameter that matches a specific HTML
   * element's id then returns that the HTML element that matches
   * the given id.
   * @param {string} id - a HTML tag's id
   * @returns {object} DOM object that matches the given string id
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Takes in a string as a parameter and returns an array of DOM objects
   * that matches the given CSS selector.
   * @param {string} selector - A CSS query selector
   * @returns {object[]} an array of DOM objects matching the given query
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Takes in a string and creates the matching DOM node
   * representing an element of the specified type by the
   * string.
   * @param {string} tagName - a DOM element tag name.
   * @returns {object} - DOM object associated with the tagName.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();