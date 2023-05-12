# library_API_REST

the library object look like this:
```
const Library = db.define('Library', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    landline: {
        // we set it to string to let people put '/()+' characters and spaces.
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});
```