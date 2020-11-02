const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const app = express();
const User = require('../models/user'); //Import the 'User' schema

app.get('/user', function(req, res) {
    from = Number(req.query.from) || 0; //Use 0 if no 'from' parameter if found on the request
    limit = Number(req.query.limit) || 0;
    //Optional parameters are used with '?' sign on the URL. Multiple parameters are separated with '&'
    //Here we will use Mongoose to return all the users from MongoDB 
    User.find({ state: true }, 'name email') //Inside {} would be the conditions to find the users inside the schema. Name and email are the only info that is going to be shown per each user 
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: true }, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    howManyUsers: count
                })
            })

        })

})

app.post('/user', function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        })

    });
});

app.put('/user/:id', function(req, res) {
    let id = req.params.id;
    //Here we say which columns of the DB could be updated
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    //Context Query mandatory in order to runValidators to work
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        //User.findByIdAndUpdate(id, body, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        })
    });

})

app.delete('/user/:id', function(req, res) {

    let id = req.params.id;

    //User.findByIdAndRemove(id, (err, deletedUser) => {
    User.findByIdAndUpdate(id, { state: false }, { new: true }, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (deletedUser === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User not found"
                }
            })
        }

        res.json({
            ok: true,
            user: deletedUser
        });
    });

})

module.exports = app;