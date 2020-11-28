const handleRegister = (req, res, db, bcrypt) => {
    //pulling data from form
    const { email, name, password } = req.body;
    //hashing the pw
    const hash = bcrypt.hashSync(password);
    //connects the tables inserts hash and email into the login table then returns the email
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      //if okay commit otherwise rollback
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register!'))
   
}

//export this function
module.exports = {
    handleRegister: handleRegister
}