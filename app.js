/**
 * Name: Christopher Ku
 * Date: 11-18-2021
 * Section CSE 154 AA
 *
 * This is a JS file that will be used to implement behaviour for my own API,
 * which is for The Contact List API provides information about different
 * people that are interested in who I am and are able to provide further
 * connections for people that visit my website.
 */
'use strict';
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const app = express();
const EMAIL_LENGTH = 13;
const NAME_LENGTH = 3;
const PORT_NUMBER = 8000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/**
 * This endpoint is responsible for handling when users want to
 * view all of the new users that just signed up to the contact
 * list on the website
 */
app.get('/getusers', async (req, res) => {
  try {
    let contents = await fs.readFile('users.json', 'utf8');
    res.json(JSON.parse(contents));
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status('400');
      res.type('text');
      res.send('Cannot find file');
    } else {
      res.status('500')
        .type('text')
        .send('Internal server error');
    }
  }
});

/**
 * This endpoint is responsible for handling new users trying
 * to join the contact list on my website by adding their name
 * and email information.
 */
app.post('/saveusers', async (req, res) => {
  let name = req.body['username'];
  let email = req.body['email'];
  if (name.length < NAME_LENGTH || email.length < EMAIL_LENGTH) {
    res.status('400')
      .type('text')
      .send('Name or email not long enough.');
  } else {
    try {
      let contents = await fs.readFile('users.json', 'utf8');
      let users = JSON.parse(contents);
      users['connected-members'].push(name + ": " + email);
      await fs.writeFile('users.json', JSON.stringify(users));
      res.type('text')
        .send('Added User!');
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.status('400')
          .type('text')
          .send('Cannot find file');
      } else {
        res.status('500')
          .type('text')
          .send('Internal server error');
      }
    }
  }
});

app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUMBER;
app.listen(PORT);