import React from 'react';

import { Alert, Carousel, Col, Row } from 'react-bootstrap';

import RecipeElement from './RecipeElement.js'

class RecipesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    setCompatibility = (recipe) => {
        if (this.props.insertedIngredients.length !== 0)
            return Math.round(100 * (recipe.Ingredients.filter(i => this.props.insertedIngredients.map(i => i.Name).includes(i.ingr))
                                                       .map(i => i.weight/100).reduce((a, b) => a + b, 0)));
    }

    render() {
        if (this.props.destination && this.props.recipes.length !== 0) {
            let recipes = [];
            for (var i = 0; i < this.props.recipes.length - 1; i = i + 2) {
                recipes.push([this.props.recipes[i], this.props.recipes[i + 1]]);
            }
            if (this.props.recipes.length % 2 !== 0) recipes.push([this.props.recipes[i]]);
            while (recipes.length > 3) recipes.pop();
            return (
                <Carousel controls={false}>
                    {recipes.map((c) =>
                        <Carousel.Item interval={10000} key={`${c[0].Name}`}>
                            <Row>
                                {c.map((r) =>
                                    <Col xs={6} key={r.Name}>
                                        <RecipeElement recipe={r} setChosenRecipe={this.props.setChosenRecipe} preview={true} insertedIngredients={this.props.insertedIngredients} setRecipe={this.props.setRecipe} />
                                    </Col>)}
                            </Row>
                        </Carousel.Item>)}
                </Carousel>
            );
        } else if (this.props.recipes.length !== 0) {
            return (
                <>
                    {this.props.recipes.filter(r => this.setCompatibility(r)).length !== 0
                        ? <Row>
                            {this.props.recipes
                            .sort((a, b) => this.setCompatibility(b) - this.setCompatibility(a))
                            .sort((a,b) => b.Ingredients.filter(i => this.props.insertedIngredients.map(i => i.Name).includes(i.ingr)).length - 
                            a.Ingredients.filter(i => this.props.insertedIngredients.map(i => i.Name).includes(i.ingr)).length)
                            .map((r) =>
                                this.setCompatibility(r) !== 0 &&
                                <Col xs={6} className="my-2" key={r.Name}>
                                    <RecipeElement recipe={r} setChosenRecipe={this.props.setChosenRecipe} preview={true} location={this.props.location}
                                        insertedIngredients={this.props.insertedIngredients} setCompatibility={this.setCompatibility} setRecipe={this.props.setRecipe} />
                                </Col>)}
                        </Row>
                        : this.props.location !== 'FavRecipes' && this.props.location !== 'LastRecipes'
                            ? <Alert variant="danger">
                                <Alert.Heading>Attention!</Alert.Heading>
                                <p>No recipes matching your ingredients or your filters!</p>
                            </Alert>
                            : <Row>
                                {this.props.recipes
                                    .sort((a, b) => this.setCompatibility(b) - this.setCompatibility(a))
                                    .sort((a,b) => b.Ingredients.filter(i => this.props.insertedIngredients.map(i => i.Name).includes(i.ingr)).length - 
                                        a.Ingredients.filter(i => this.props.insertedIngredients.map(i => i.Name).includes(i.ingr)).length)
                                    .map((r) =>
                                        this.setCompatibility(r) !== 0 &&
                                        <Col xs={6} className="my-2" key={r.Name}>
                                            <RecipeElement recipe={r} setChosenRecipe={this.props.setChosenRecipe} preview={true} location={this.props.location}
                                                insertedIngredients={this.props.insertedIngredients} setRecipe={this.props.setRecipe} setCompatibility={this.setCompatibility} />
                                        </Col>)}
                            </Row>
                    }
                </>);
        } else {
            return (
                <>
                    {this.props.location &&
                        <Alert variant="danger">
                            <Alert.Heading>Attention!</Alert.Heading>
                            <p>No recipes matching your ingredients or your filters!</p>
                        </Alert>}
                    {this.props.destination &&
                        <Alert variant="info">
                            <Alert.Heading>There's still nothing here!</Alert.Heading>
                            <p>
                                {this.props.destination === '/last_recipes'
                                    ? "Start using the app to create a history of your latest recipes."
                                    : "Start using the app and add your first favourite recipe."}
                            </p>
                        </Alert>}
                </>
            );
        }
    }
}


export default RecipesList;
