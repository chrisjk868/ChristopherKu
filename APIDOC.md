# Contact List API Documentation
The Contact List API provides information about different people that are interested in who I am and are able to provide further connections for people that visit my website.

## Get a list of all members that are on the contact list
**Request Format:** /getusers

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns a JSON object containing all users that are on the current contact list


**Example Request:** /getusers

**Example Response:**

```json
{
    "connected-members":[
        "Christopher: chrisjk868@gmail.com",
        "Neil Ng: neil@gmail.com",
        "Benjamin: benjamin@gmail.com",
        "Natalie: natalie@gmail.com",
        "Brendan: brendan@gmail.com",
        "newuser: newuser@gmail.com"
    ]
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If JSON file containing user information cannot be found.
- Possible 500 errors (all plain text):
  - If internal server is experiencing an issue.

## Adding a new user to join to current contact list
**Request Format:** /saveusers

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Adds the user to the contact and sends backs a text response indicating if the user is added or not

**Example Request:** /saveusers

**Example Response:**

```
Added User!
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If JSON file containing user information cannot be found.
- Possible 500 errors (all plain text):
  - If internal server is experiencing an issue.
