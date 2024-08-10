const express = require('express');
const passport = require('./auth');
const Player = require('./models/Player');
const { Long } = require('mongodb');
const path = require('path');

const router = express.Router();

// Route pour la page d'accueil
router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        const userId = user.id;

        console.log(`User ID from Discord: ${userId}`);

        try {
            const playerId = Long.fromString(userId.toString());
            const player = await Player.findById(playerId);
            if (player) {
                res.render('homestarted', {
                    avatarUrl: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '',
                    username: user.username,
                    money: player.money,
                    level: player.level,
                    xp: player.xp,
                    mana: player.mana,
                    health: player.health,
                    strength: player.strength,
                    dexterity: player.dexterity,
                    intelligence: player.intelligence,
                    speed: player.speed,
                });
            } else {
                res.render('home', {
                    avatarUrl: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '',
                    username: user.username,
                });
            }


        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.render('login');
    }
});

// Route pour l'authentification avec Discord
router.get('/auth/discord', passport.authenticate('discord'));


router.get('/partener', (req, res) => {
    res.render('partener');
});

router.get('/loginpage', (req, res) => {
    res.render('login');
});

router.get('/profil', async (req, res) => {
    const user = req.user;
    const userId = user.id;
    const playerId = Long.fromString(userId.toString());
    const player = await Player.findById(playerId);
    res.render('profil', {
        avatarUrl: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '',
        username: user.username,
        money: player.money,
        level: player.level,
        xp: player.xp,
        mana: player.mana,
        health: player.health,
        strength: player.strength,
        dexterity: player.dexterity,
        intelligence: player.intelligence,
        speed: player.speed,
    });
});

router.get('/partenerlogin', (req, res) => {
    res.render('partenerlogin');
});

router.get('/vote', (req, res) => {
    res.render('vote');
});

// Route pour le callback de Discord
router.get('/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/');
});

// Route pour la déconnexion
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;