import React from 'react';

import { Link } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';

class IngredientElement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        if (!this.props.inserted && !this.props.category) {
            return (
                <Card style={{ borderRightColor: '#adadad', borderBottomColor: '#adadad' }} onClick={()=>this.props.addIngredient(this.props.ingredient)}>
                    <Link to={'/results'}>
                        <Card.Img src={this.props.ingredient.Photo} alt="Ingredient" />
                        <Card.ImgOverlay className="recipe_overlay">
                            <Card.Title className="bg_caption_recipes d-flex align-items-center">
                                <div className="caption_recipes font_text">
                                    {this.props.ingredient.Name}
                                </div>
                            </Card.Title>
                        </Card.ImgOverlay>
                    </Link>
                </Card>
            );
        } else if (!this.props.category) {
            return (
                <Image style={{ border: "6px solid white" }} src={this.props.ingredient.Photo} width={55} height={55} roundedCircle />
            );
        } else {
            return (
                <Link to={'/results'}>
                    <Image src={this.props.ingredient.Photo} width={'100%'} onClick={()=> this.props.addIngredient(this.props.ingredient)}/>
                    <div className="bg_caption_recipe d-flex align-items-center" style={{ width: '100%' }}>
                        <h1 className="caption_recipe font_text d-flex align-items-center">
                            {this.props.ingredient.Name}
                        </h1>
                    </div>
                </Link>
            );
        }
    }
}

export default IngredientElement;
