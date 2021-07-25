# Dev Environment

- Install dependencies by typing `npm i` inside the `/api` folder
- Run MongoDB Server (H2 Computing should have set it up already)
- Run dev server with `npm run dev` inside the `/api` folder (Any changes saved will automatically trigger a reload in dev mode)
	- You might have to install `nodemon` using `npm install -g nodemon` before `npm run dev` will work
- If in production, use `npm start`

# API Documentation

**API Response Format**
| Response                                    | Definition                                                   |
| ------------------------------------------- | ------------------------------------------------------------ |
| `{"success": true}`                         | The request was successfully completed                       |
| `{"success": false, "error": "ERROR_CODE"}` | The request was unsuccessful due to the error stated in `error` |

**General Errors (error codes might not be the same)**
| Error           | Error Code | Definition                                                   |
| --------------- | ---------- | ------------------------------------------------------------ |
| `unknown`       | 500        | The reason for the failure is not documented                 |
| `missing-token` | 401        | The request did not send an `Authorization` header, but the endpoint is authenticated |
| `wrong-token`   | 401        | The token sent has either expired or been tampered with      |
| `insufficient-perms`   | 403        | The user does not have sufficient permissions to run the operation |
| `validation-error`    | 400        | The input was malformed                                      |
| `deleted-user`    | 400        | The token is still valid but the user has been deleted from the database                                      |

**Account Level Permissions**
| Permission Level | Title | Description of Pemrissions |
| --------------- | ---------- | ------------------------------------------------------------ |
| `0` | Normal User | Normal registered user with permissions to review, rate etc. | 
| `1` | Individual/Private Tutor | Able to post their own private tutor listings & manage them |
| `2` | Tuition Centre | Post tuition centre listings, manage individual tutor accounts | 
| `3` | Admin | All permissions | 

## Basic

### `GET /status`

Returns the api version and status

**Input**

```
<None>
```

**Output**

```json
{
    "success": true,
    "version": 0,
    "status": "good"
}
```

## Accounts

### `POST /accounts/login`

Returns the JWT for the given account

**Input**

```json
{
    "username": "<username>",
    "password": "<password>"
}
```

**Output**

```json
{
	"success": true,
    "token": "<JWT token>",
    "username": "<username>",
    "perms": "<perms>"
}
```

**Errors**

| Error            | Definition                           |
| ---------------- | ------------------------------------ |
| `incorrect` | The username/password was incorrect |

**Remarks**

The username can be obtained from the JWT token (for display purposes)


### `POST /accounts/register`

Register a new account

**Input**

```json
{
    "username": "<username>",
    "password": "<password>",
    "email": "<email>"
}
```

**Output**

```json
{
	"success": true
}
```

**Errors**

| Error            | Definition                           |
| ---------------- | ------------------------------------ |
| `username-taken` | The username entered already exists |
| `email-taken` | The email entered already exists |


### `GET /accounts/checkPerms`
`Authorization required`

Check the permissions level of an account given a token

**Input**

```json
    <none>
```

**Output**

```json
{
	"success": true,
    "perms": 0 (int),
    "username": "<username>"
}
```

**Errors**

| Error            | Definition                           |
| ---------------- | ------------------------------------ |
| `not-found` | The user does not exist in the DB for some reason |


### `POST /accounts/deleteAcc`
`Authorization required`

Delete the user's **own account**

**Input**

```json
{
    "oldPassword": "<User's password>"
}
```

**Output**

```json
{
	"success": true
}
```

**Errors**

| Error            | Definition                           |
| ---------------- | ------------------------------------ |
| `not-found` | The user does not exist in the DB for some reason |
| `incorrect-old-pass` | The password the user entered is incorrect |

**Remarks**

The user should be logged out after this action


### `POST /accounts/changePassword`
`Authorization required`

Change the user's own password

**Input**

```json
{
    "oldPassword": "<User's password>",
    "password": "<User's new password>"
}
```

**Output**

```json
{
	"success": true
}
```

**Errors**

| Error            | Definition                           |
| ---------------- | ------------------------------------ |
| `not-found` | The user does not exist in the DB for some reason |
| `incorrect-old-pass` | The old password the user entered is incorrect |

### `GET /accounts/list`
`Admin Authorization required`

Returns the list of users with their usernames, emails and perms level

**Input**

```json
    <None>
```

**Output**

```json
{
	"success": true,
    "users": [{"username": "user1", "email": "email1", "perms": 0}]
}
```


### `POST /accounts/changePerms`
`Admin Authorization required`

Change the permissions level of a user

**Input**

```json
{
    "users": ["<user1>", "<user2>"...],
    "perms": 0
}
```

**Output**

```json
{
	"success": true
}
```

**Errors**

| Error            | Definition                           |
| ---------------- | ------------------------------------ |
| `not-found` | None of the users chosen exist in the DB for some reason |


### `POST /accounts/adminDeleteAcc`
`Admin Authorization required`

Delete multiple user accounts

**Input**

```json
{
    "users": ["<user1>", "<user2>"...]
}
```

**Output**

```json
{
	"success": true
}
```

**Errors**

| Error            | Definition                           |
| ---------------- | ------------------------------------ |
| `not-found` | None of the users chosen exist in the DB for some reason |


### `POST /accounts/adminChangePassword`
`Admin Authorization required`

Change the password of a user

**Input**

```json
{
    "username": "<username>",
    "password": "<new password>"
}
```

**Output**

```json
{
	"success": true
}
```

**Errors**

| Error            | Definition                           |
| ---------------- | ------------------------------------ |
| `not-found` | The username was not found |
