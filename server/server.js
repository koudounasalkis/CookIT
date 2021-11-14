const express = require('express');
//const moment = require('moment');
const dao = require('./dao');

/** Validation library */ 
const { check, validationResult } = require('express-validator'); 
/** Logging middleware */
const morgan = require('morgan'); 

/** Create application */ 
const PORT = 3001;
app = new express();

/** Set-up logging */ 
app.use(morgan('tiny'));

/** Process body content */ 
app.use(express.json());

/** DB error */ 
const dbErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };

/** GET /recipes */
app.get('/api/recipes', (req, res) => {
    dao.getRecipes(req.query.favorite)
        .then((recipes) => {
            res.json(recipes);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
            });
       });
});

/** POST /addFavorite */
app.post('/api/addFavorite', [
    check('name').isString()
    ], (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        dao.addFavoriteRecipe(req.body.name)
            .then((response) => res.end())
            .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});

/** POST /removeFavorite */
app.post('/api/removeFavorite', [
    check('name').isString()
    ], (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        dao.removeFavoriteRecipe(req.body.name)
            .then((response) => res.end())
            .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});

/** POST /updateTimestampRecipe */
app.post('/api/updateTimestampRecipe', [
    check('name').isString()
    ], (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        dao.updateTimestampRecipe(req.body.timestamp, req.body.name)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});

/** GET /ingredients */
app.get('/api/ingredients', (req, res) => {
    dao.getIngredients()
        .then((ingredients) => {
            res.json(ingredients);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
            });
       });
});

/** POST /updateTimestampIngredient */
app.post('/api/updateTimestampIngredient', [
    check('name').isString()
    ], (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        dao.updateTimestampIngredient(req.body.timestamp, req.body.name)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));