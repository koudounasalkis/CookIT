import Ingredient from './Ingredient';
import Recipe from './Recipe';

const baseURL = "/api";

async function getRecipes(filter) {
    let url = "/recipes";
    if (filter) {
        const favParams = "?category=true";
        url += favParams;
    }
    const response = await fetch(baseURL + url);
    const recipesJson = await response.json();
    if (response.ok)
        return recipesJson.map((r) => new Recipe(r.Name, r.Covers, r.Difficulty, r.Portion, r.TimePreparation,
            r.Diet, r.Meal, r.Favourite, r.LastTimestamp, r.Introduction, r.Ingredients, r.Preparation));
    else
        throw recipesJson;  // An object with the error coming from the server
}


async function addFavoriteRecipe(name) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/addFavorite", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name }),
        })
            .then((response) => {
                if (response.ok)
                    resolve();
                else {
                    response.json()
                        .then((obj) => { reject(obj); }) // error msg in the response body
                        .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                }
            })
            .catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


async function removeFavoriteRecipe(name) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/removeFavorite", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name }),
        })
            .then((response) => {
                if (response.ok)
                    resolve();
                else {
                    response.json()
                        .then((obj) => { reject(obj); }) // error msg in the response body
                        .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                }
            })
            .catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


async function updateTimestampRecipe(timestamp, name) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/updateTimestampRecipe", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, timestamp: timestamp }),
        })
            .then((response) => {
                if (response.ok)
                    resolve();
                else {
                    response.json()
                        .then((obj) => { reject(obj); }) // error msg in the response body
                        .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                }
            })
            .catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


async function getIngredients() {
    let url = "/ingredients";
    const response = await fetch(baseURL + url);
    const ingredientsJson = await response.json();
    if (response.ok)
        return ingredientsJson.map((i) => new Ingredient(i.Name, i.Category, i.LastTimestamp, i.Photo));
    else
        throw ingredientsJson;  // An object with the error coming from the server
}


async function updateTimestampIngredient(timestamp, name) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/updateTimestampIngredient", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, timestamp: timestamp }),
        })
            .then((response) => {
                if (response.ok)
                    resolve();
                else {
                    response.json()
                        .then((obj) => { reject(obj); }) // error msg in the response body
                        .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                }
            })
            .catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

const API = { getRecipes, addFavoriteRecipe, removeFavoriteRecipe, updateTimestampRecipe, getIngredients, updateTimestampIngredient };
export default API;