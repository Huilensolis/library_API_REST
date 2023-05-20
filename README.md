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

Before building this project i had no experience building aplications with Node js, Express, Sequelize or either Passport-jwt, in fact, i hadn't even known how a backend really worked. After this project i feel with a little more confidence to build a project in the Backend and Frontend both.

As i didnt know anything from before, i supported myself from the Sequelize docuemntation, where i guided myself from 0 to 100.
Without forgeting about the guides the bootcamp's mentors have provided, obiously. Something I am new at and I have really liekd to learn, is to build projects in modules, that's soemthing i didntk heared before in the classes they teached us to build by modules from the beggining, so its something i aprecciate. So this project is build by modules. 

I divided the project in different stages:
### - Frist stage: Database, models and routes.
1. Initialize the database.
2. Create the models for Library, Book and User.
3. Create the routes to CRUD the 3 already mentioned models.

- i initializated the database: I save the configuration in a folder "db". where i initialize the database, saving the data into a "db" file inside the same folder and i determine the dialect to sqlite3.
- I create the models: I save all the models in the "models" folder, where i declare all their properties and data validations.
- I create the routes to CRUD the models: I create and save the routes in the "routes folder".

### - Second stage: Log In route, Pasport-jwt Strategy and Auth middleware
1. Log In route
2. Define a Passport-jwt Strategy
3. Create a middleware uses the Passport-Jwt Strategy

- I create the Log In route: when a post req is received, it verifies that the user exist and the passpord matches, while it ends the req with a signed token as a response
- I define the Passport-jwt Strategy, where i verify the user exist and the password matches for second time.
- Create a middleware which uses the before defined passport-jwt Srategy and stops the middlewares execution chain.
- Assing that middleware to every action in the crud which requires authentication and admin role.

When i finished the project, i decided to polish the code, setting the adecuatetd code status for every response. And at the same time creating a errorHandler, which is a class for sending responses in a more legible format, so I implemented the errorHandler to the response json in the errors cases.

Irealized there is a lot of code which is just verifying the data types and request body, so I was willing to implement it into my aplication, but now (when i write this), the module ahs finsihed and I must continue with the bootcamp shedule to learn Angular next.

## API Documentation

For detailed information on how to use the API, refer to the API documentation, which provides endpoint details, request/response examples, and authentication requirements.

The API aims to provide a comprehensive solution for managing libraries and books, incorporating authentication and following the CRUD principles for data operations.
