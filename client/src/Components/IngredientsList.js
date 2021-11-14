import React from 'react';

import { Alert, Carousel, Col, Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import IngredientElement from './IngredientElement.js'

class IngredientsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        if (this.props.destination && this.props.ingredients.length !== 0 && !this.props.inserted && !this.props.category) {
            let ingredients = [];
            for (var i = 0; i < this.props.ingredients.length - 1; i = i + 2) {
                ingredients.push([this.props.ingredients[i], this.props.ingredients[i + 1]]);
            }
            if (this.props.ingredients.length % 2 !== 0) ingredients.push([this.props.ingredients[i]]);
            while (ingredients.length > 3) ingredients.pop();
            return (
                <Carousel controls={false}>
                    {ingredients.map((c) =>
                        <Carousel.Item interval={10000} key={`${c[0].Name}`}>
                            <Row>
                                {c.map((i) => <Col xs={6} key={i.Name}>
                                    <IngredientElement ingredient={i} addIngredient={this.props.addIngredient}/>
                                </Col>)}
                            </Row>
                        </Carousel.Item>)}
                </Carousel>
            );
        } else if (this.props.ingredients.length !== 0 && !this.props.inserted && !this.props.category) {
            return (
                <Row>
                    {this.props.ingredients.map((i) =>
                        <Col xs={6} className="my-2" key={i.Name}>
                            <IngredientElement ingredient={i} addIngredient={this.props.addIngredient} />
                        </Col>)}
                </Row>
            );
        } else if (this.props.ingredients.length !== 0 && this.props.inserted) {
            return (
                <>
                    <Row className="justify-content-center mx-2">
                        {this.props.ingredients.map((i) =>
                            <Col xs={3} className="text-center" key={i.Name}>
                                <div style={{ marginTop: '-15px' }}>
                                    {this.props.ingredients.length === 1
                                        ? <Link to={{pathname: '/'}}><Image className="image1" src="icons/filter/error.svg" width={15} height={15} onClick={() => {this.props.deleteIngredient(i); this.props.clearFilterChoices();}}/></Link>
                                        : <Image className="image1" src="icons/filter/error.svg" width={15} height={15} onClick={() => this.props.deleteIngredient(i)}/>}
                                </div>
                                <div>
                                    <IngredientElement className="image2" ingredient={i} inserted={this.props.inserted}/>
                                </div>
                                <h6 className="image3">{i.Name}</h6>
                            </Col>)}
                    </Row>
                </>
            );
        } else if (this.props.ingredients.length !== 0 && this.props.category) {
            return (
                <Row >
                    <h4 className="my-2 ml-3 font_text" style={{ fontWeight: 'bold', color: ' #f3a42d' }}>SELECT PRODUCT</h4>
                    {this.props.ingredients
                        .filter((i) => i.Category === this.props.category)
                        .sort((a, b) => a.Name.localeCompare(b.Name))
                        .map((i) =>
                            <Col xs={6} className="my-2" key={i.Name}>
                                <IngredientElement className="image2" ingredient={i} addIngredient={this.props.addIngredient} setCategory={this.props.setCategory}/>
                            </Col>)}
                </Row>
            );
        } else {
            return (
                <>
                    {this.props.destination &&
                        <Alert variant="info">
                            <Alert.Heading>There's still nothing here!</Alert.Heading>
                            <p>Start using the app to create a history of your latest ingredients."</p>
                        </Alert>}
                </>
            );
        }
    }
}


export default IngredientsList;
