require('dotenv').config();

var userNormalizer = require('../user/userNormalizer');
var User = require('../../models').User;
var Role = require('../../models').Role;
var bcrypt = require('bcrypt');
var response = require('../../helper/response');
var jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    normalizerResult = userNormalizer.registerNormalize(req);
    if (normalizerResult !== null) {
        return res.status(normalizerResult.meta.status).send(normalizerResult);
    }

    existingUser = await User.findOne({
        where: {
            username: req.body.username
        }
    });

    if (existingUser !== null) {
        return res.status(400).send(response.errorResponse('Username already exists!', 400));
    }

    existingUser = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    if (existingUser !== null) {
        return res.status(400).send(response.errorResponse('Email already exists!', 400));
    }

    role = await Role.findOne({
        where: {
            id: req.body.role_id
        }
    });

    if (role == null) {
        return res.status(400).send(response.errorResponse('Role invalid!', 400));
    }

    try {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
        user = {
            username: req.body.username,
            hashed_password: hashedPassword,
            email: req.body.email,
            RoleId: req.body.role_id
        }
        jwt_token = jwt.sign(user, process.env.JWT_SECRET).toString();
        return User.create(user).then (
            user => res.status(200).send(response.response(
                {
                    jwt_token: jwt_token
                },
                'Registration successful!',
                200
            ))
        )
    } catch {
        res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};

exports.login = async (req, res) => {
    normalizerResult = userNormalizer.loginNormalize(req);
    if (normalizerResult !== null) {
        return res.status(normalizerResult.meta.status).send(normalizerResult);
    }

    user = null;
    if (req.body.username) {
        user = await User.findOne({
            where: {
                username: req.body.username
            }
        });
    } else {
        user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
    }

    if (user == null) {
        return res.status(400).send(response.errorResponse('User not found!', 400));
    }

    try {
        if (await bcrypt.compare(req.body.password, user.hashed_password)) {
            user = {
                username: user.username,
                hashed_password: user.hashed_password,
                email: user.email,
                RoleId: user.RoleId
            };
            jwt_token = jwt.sign(user, process.env.JWT_SECRET).toString();
            return res.status(200).send(response.response(
                {
                    jwt_token: jwt_token
                },
                'Login successful!',
                200
            ));
        } else {
            return res.status(400).send(response.errorResponse(
                'Wrong password!',
                400
            ));
        }
    } catch (e) {
        res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};

exports.validate = async (req, res) => {
    if (req.user != null) {
        req.user.hashed_password = undefined;
        res.status(200).send(response.response(
            req.user,
            'Session valid!',
            200
        ));
    }
};