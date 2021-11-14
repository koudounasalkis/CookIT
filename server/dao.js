'use strict'

const db = require('./db');
const Recipe = require('./recipe');
const Ingredient = require('./ingredient');

/**
 * Function to create a Recipe object from a row of the recipes table
 * @param {*} row a row of the recipes table
 */
const createRecipe = function (row) {
  return new Recipe(row.Name, row.Covers, row.Difficulty, row.Portion, row.TimePreparation, row.Diet, row.Meal,
    row.Favourite, row.LastTimestamp, row.Introduction, row.Ingredients, row.Preparation);
}


/**
 * Function to create an Ingredient object from a row of the ingredients table
 * @param {*} row a row of the ingredients table
 */
const createIngredient = function (row) {
  return new Ingredient(row.Name, row.Category, row.LastTimestamp, row.Photo);
}

/** Get recipes and optionally filter them (favorites)*/
exports.getRecipes = function(filterFavorite) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Recipe';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        let recipes = rows.map((row) => createRecipe(row));
        if (filterFavorite) {
          recipes = recipes.filter((r) => r.Favourite === true);
        }
        resolve(recipes);
      }
    });
  });
}

/** Add a recipe to favorites */
exports.addFavoriteRecipe = function(name) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Recipe SET Favourite = 1 WHERE Name = ?';
    db.run(sql, [name], function (err) {
      if (err) {
        console.log(name);
        console.log(err);
        reject(err);
      }
      else 
        resolve(this.lastID);
    });
  });
}

/** Remove a recipe from favorites */
exports.removeFavoriteRecipe = function(name) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Recipe SET Favourite = 0 WHERE Name = ?';
    db.run(sql, [name], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else 
        resolve(this.lastID);
    });
  });
}

/** Update Timestamp value of the recipe */
exports.updateTimestampRecipe = function(timestamp,name) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Recipe SET LastTimestamp = ? WHERE Name = ?';
    db.run(sql, [timestamp, name], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else 
        resolve(this.lastID);
    });
  });
}

/** Get ingredients */
exports.getIngredients = function() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Ingredient';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        let ingredients = rows.map((row) => createIngredient(row));
        resolve(ingredients);
      }
    });
  });
}

/** Update Timestamp value of the ingredient */
exports.updateTimestampIngredient = function(timestamp,name) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Ingredient SET LastTimestamp = ? WHERE Name = ?';
    db.run(sql, [timestamp, name], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else 
        resolve(this.lastID);
    });
  });
}