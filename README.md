# smongo
Mongoose Wrapper

```js
const smongo = require('smongo');

var db = smongo('lpchat', {
  User: require('./user'),
});

db.User.find({}).then(users => console.log(users));
```

## Model

```js
module.exports = (fields, list, item, db) => {

  // Fields ====================================================================

  fields({
    username:       { type: String, default: '' },
    email:          { type: String, default: 'example@mail.ru' },
  });

  // Static Methods ============================================================

  list.confirmEmail = (key) => db.Confirmation
    .findOne({
      key: key,
    });

  // Instance Methods ========================================================

  item.updateActivity = self => {
    self.lastActivity = new Date();
    return self.save();
  };

};
```
