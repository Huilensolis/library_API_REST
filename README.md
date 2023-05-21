# Library API REST

## Table of Contents
// here we will use icons to redirect.
1. [Project Goal](#project-goal)
2. [Developing Experience](#developing-experience)
3. [API Documentation](#api-documentation)

## Project Goal

This project was developed as part of the Xacademy bootcamp. The main objective was to create a RESTful API using Node.js, Express, Sequelize, and Passport to manage libraries and their associated books. The API allows performing CRUD (Create, Read, Update, Delete) operations on libraries and books while enforcing authentication for specific actions.

During the development process, the following entities were considered:

### Library
Represents a library entity with the following attributes:
- ID: The unique identifier of the library.
- Name: The name of the library.
- Location: The physical address of the library.
- Phone: The contact phone number of the library.

Libraries can have zero or more associated books.

### Book
Represents a book entity with the following attributes:
- ID: The unique identifier of the book.
- ISBN: A unique identifier worldwide that represents the book, author version, and year of edition.
- Title: The title of the book.
- Author: The author of the book.
- Year: The year of edition of the book.
- Library: The identifier of the library to which the book belongs.

Multiple books can have the same attributes except for the ID.

### User
Represents a user of the system. User entities are created in the database during the system's initialization. The project defines a predefined user with the username "admin" and password "admin" which has permissions to do actions as an Admin.
- ID: The unique identifier of the book.
- username: the unique identificator of the the user, which is used to log in.
- name: the real name of the user.
- email: a unique email which is asociated to the user account.
- password: a password to log in
- role: the role of the user in the system

The API provides the following actions for each entity:

#### Library
- Create a library (requires authentication)
- Get a specific library with all its associated books
- Get all libraries
- Modify a library (requires authentication)
- Delete a library (soft delete, marking it as deleted in the database) (requires authentication)
- Add a new book to a library (requires authentication)

#### Book
- Create a book (requires authentication)
- Get a specific book
- Get all books
- Modify a book (requires authentication)
- Delete a book (soft delete) (requires authentication)

#### User
- Login action to authenticate a user
- Get all users
- Get a specific user
- Create a user (requires authentication)
- Update a user (requires authentication)
- Delete a user (soft delete) (requires authentication)

## Developing Experience

Before starting this project, I had no prior experience building applications with Node.js, Express, Sequelize, or Passport-JWT. In fact, I didn't have a deep understanding of how backend development worked. However, after completing this project, I gained confidence and knowledge in both backend and frontend development.

To kickstart my learning process, I referred to the Sequelize documentation, which provided comprehensive guidance from the basics to advanced concepts. Of course, I also relied on the guidance and support from the mentors in the bootcamp, which proved invaluable. One aspect that stood out to me was the concept of building projects in modules. This was something new to me, and I found it to be an effective and organized approach that I appreciate. Consequently, this project is structured using modules.

I divided the project into different stages to ensure a structured and systematic development approach:

### First Stage: Database, Models, and Routes
1. Database Initialization:
- I initialized the database and saved the configuration in the "db" folder. The data is stored in a "db" file within the same folder, and I chose the SQLite3 dialect.
2. Model Creation:
- I created the models for Library, Book, and User, saving them in the "models" folder. In these models, I defined the properties and data validations for each entity.
3. Routes for CRUD Operations:
- I created and saved the routes in the "routes" folder to handle the CRUD operations for the aforementioned models.

### Second Stage: Log In Route, Passport-JWT Strategy, and Auth Middleware
1. Log In Route:
- I implemented a log-in route that verifies the existence of the user and checks if the password matches. Upon successful authentication, the route responds with a signed token.
2. Passport-JWT Strategy:
- I defined a Passport-JWT strategy to verify the user's existence and validate the password for a second time.
3. Auth Middleware:
- I created a middleware that utilizes the Passport-JWT strategy. This middleware is responsible for authenticating requests and stopping the execution chain if authentication fails. It is applied to all actions in the CRUD operations that require authentication and an admin role.

After completing the project, I focused on code refinement. I ensured that the appropriate HTTP status codes were set for each response. Additionally, I created (in the "utils" folder) an errorHandler class to send responses in a more readable format, enhancing the overall response structure.

During the development process, I realized that a significant amount of code was dedicated to verifying data types and request bodies. To streamline this process, I intended to implement the Express Validator module. However, at the time of writing this, the Node module is still in progress, and I need to proceed with the bootcamp schedule to learn Angular.

Overall, this project provided me with valuable hands-on experience in building a RESTful API using popular frameworks and libraries. It helped me gain confidence in backend development and taught me essential concepts such as modularization, authentication, and error handling.

## API Documentation

For detailed information on how to use the API, refer to the API documentation, which provides endpoint details, request/response examples, and authentication requirements.

The API aims to provide a comprehensive solution for managing libraries and books, incorporating authentication and following the CRUD principles for data operations.

the content type will always be:
```
  Content-Type: application/json
```
### Authentication
Log In 
- Method: POST
- URL: /login
- Description: Authenticates a user and returns a signed token for subsequent requests.
- Request Body:
  - username: (string) The username of the user.
  - password: (string) The password of the user.
- Example Request:
  - POST /login
```
{
  "username": "string",
  "password": "string"
}
```
this will give you a token, which you will need paste as a baeren token.

To do actions which require uthentication, and to create a user (because the api actually has 0 data in), you will need to log in as:
```
  "username": "admin",
  "password": "admin"
```

### Users
Get All Users
- Method: GET
- URL: /users
- Description: Retrieves all users.
- Example Request:
  - GET /users

#### Get User by ID
- Method: GET
- URL: /users/{id}
- Description: Retrieves a specific user by ID.
- Example Request:
  - GET /user/1

#### Create User
- Method: POST
- URL: /users
- Description: Creates a new user.
- Request Body:
  - name: (string) The name of the user.
  - email: (string) The email address of the user.
  - password: (string) The password of the user.
- Example Request:
```
{
	"username": "string",
	"name": "string",
	"email": "string@gmail.com",
	"password": "string"
}
```

#### Update User
- Method: PUT
- URL: /users/{id}
- Description: Updates an existing user.
- Request Body (you can update as many propieties as you want):
  - username: (string) the udpated username of the user
  - name: (string) The updated name of the user.
  - email: (string) The updated email address of the user.
- Example Request:
```
  username: "pepe"
```

#### Delete User
- Method: DELETE
- URL: /users/{id}
- Description: Deletes a user.
- Example Request:
  - DELETE /users/1

### Books
#### Get All Books
- Method: GET
- URL: /book
- Description: Retrieves all books.
- Example Request:
  - GET /book

#### Get Book by ID
- Method: GET
- URL: /book/{id}
- Description: Retrieves a specific book by ID.
- Example Request:
  - GET /book/1

#### Create Book
- Method: POST
- URL: /book
- Description: Creates a new book.
- Request Body:
  - isbn: the unique identificator of the book.
  - title: (string) The title of the book.
  - author: (string) The author of the book.
  - year: (string) The year of publication of the book.
  - LibraryId: the asociated library of the book, it can be null.
- Example Request:
```
{
  "isbn": 1235125
  "title": "Book 3",
  "author": "Author 3",
  "year": 2024,
  "LibraryId": 1
}
```

#### Update Book
- Method: PUT
- URL: /book/{id}
- Description: Updates an existing book.
- Request Body:
  - isbn:  the unique identificator of the book.
  - title: (string) The updated title of the book.
  - author: (string) The updated author of the book.
  - year: (string) The updated year of publication of the book.
- Example Request:
```
{
  "isbn": 12354
  "title": "Updated Book",
  "author": "Updated Author",
  "year": 2023
}
```

#### Delete Book
- Method: DELETE
- URL: /book/{id}
- Description: Deletes a book.
- Example Request:
  - DELETE /book/1

#### Libraries
- Get All Libraries
- Method: GET
- URL: /library
- Description: Retrieves all libraries along with their associated books.
- Example Request:
  - GET /library

#### Get Library by ID
- Method: GET
- URL: /library/{id}
- Description: Retrieves a specific library by ID along with its associated books.
- Example Request:
  - GET /library/1

#### Create Library
- Method: POST
- URL: /library
- Description: Creates a new library.
- Request Body:
  - name: (string) The name of the library.
  - location: (string) The location of the library.
  - phone: (string) The phone number of the library.
- Example Request:
```
{
	"name": "string",
	"location": "string",
	"landline": "12412414"
}
```

#### Update Library
- Method: PUT
- URL: /library/{id}
- Description: Updates an existing library.
- Request Body:
  - name: (string) The updated name of the library.
  - location: (string) The updated location of the library.
  - phone: (string) The updated phone number of the library.
- Example Request:
```
{
  "name": "Updated Library",
  "location": "Updated Location",
  "phone": "9999999999"
}
```

#### Delete Library
- Method: DELETE
- URL: /library/{id}
- Description: Deletes a library.
- Example Request:
  - DELETE /library/1
