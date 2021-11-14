import React from 'react';

import { Link } from 'react-router-dom';
import { Card, Image, ListGroup, Row, Button, Col, Badge } from 'react-bootstrap';

import RecipeModal from './RecipeModal';
import API from '../Api/API';

class RecipeElement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            favourite: '',
            recipeUpdated: false,
            ingredientsUpdated: false,
        }
    }

    componentDidMount() {
        if (!this.props.preview) {
            this.props.setRecipe(this.props.recipe.Name);
            this.setState({ favourite: this.props.recipe.Favourite });
        }
    }

    setShow = () => {
        this.setState({ show: !this.state.show });
    }

    setFavourite = () => {
        if (this.state.favourite) {
            API.removeFavoriteRecipe(this.props.recipe.Name).then(() => {
                this.setState({favourite: false}, () => this.props.updatelists(false));
            }).catch((error) => console.log(error));
        } else {
            API.addFavoriteRecipe(this.props.recipe.Name).then(() => {
                this.setState({favourite: true}, () => this.props.updatelists(false));
            }).catch((error) => console.log(error));
        }
    }

    render() {
        if (this.props.preview) {
            return (
            <>
                <Card className="rounded mb-0" style={{ borderRightColor: '#adadad', borderBottomColor: '#adadad'}}>
                    <Link to={'/recipe'} onClick={() => {
                        this.props.setChosenRecipe(this.props.recipe);}}>
                        <Card.Img src={this.props.recipe.Covers.thumbnail} alt="Recipe" />
                        <Card.ImgOverlay className="recipe_overlay">
                            <Card.Title className="bg_caption_recipes rounded d-flex align-items-center">                                
                                <div className="caption_recipes rounded font_text">
                                    {this.props.recipe.Name}
                                </div>
                            </Card.Title>
                        </Card.ImgOverlay>
                    </Link>
                </Card>
                {this.props.location === 'Results' && 
                    <div style={{fontSize: '11px'}}>
                        {this.props.setCompatibility(this.props.recipe)}
                        % compatible with
                        <h6>{this.props.recipe.Ingredients.filter(i => this.props.insertedIngredients.map(i => i.Name).includes(i.ingr)).map(i => i.ingr).join(", ")}</h6>
                    </div>}
            </>);
        } else {
            let array = [];
            for (var i = 0; i < this.props.recipe.Difficulty; i++) {
                let tuple = [1,i];
                array.push(tuple);
            }
            for (var j = 0; j < 5 - this.props.recipe.Difficulty; j++) {
                let tuple = [0,j];
                array.push(tuple);
            }
            return (
                <>
                    <RecipeModal show={this.state.show} setShow={this.setShow} preparation={this.props.recipe.Preparation} cover={this.props.recipe.Covers.cover}/>

                    <Card style={{ marginRight: '-20px', marginLeft: '-20px', padding: '0px' }}/*fixed-top*/>
                        <Card.Img src={this.props.recipe.Covers.cover} alt="Recipe" />
                        <Card.ImgOverlay className="recipe_overlay">
                            <Row className="justify-content-between mx-auto">
                                <Card.Title>
                                    <i className={this.state.favourite ? "fas fa-heart mx-3 my-3" : "far fa-heart mx-3 my-3"}
                                        style={{ color: this.state.favourite ? 'red' : 'black' }}
                                        onClick={() => { this.setFavourite() }} />
                                </Card.Title>
                                <Card.Title className="bg_recipe_info">
                                    <div

className="my-auto font_text" style={{ fontSize: '20px', color: 'white' }}>
                                        <div>Difficulty</div>
                                        {array.map((el) => <i className={el[0] ? "fas fa-star fa-xs" : "far fa-star fa-xs"} key={`${el[0]} + ${el[1]}`}/>)}
                                        <div className="mt-2">Portions</div>
                                        <h6>{this.props.recipe.Portion} people</h6>
                                        <div className="mt-2">Time</div>
                                        <h6>{this.props.recipe.TimePreparation} minutes</h6>
                                    </div>
                                </Card.Title>
                            </Row>
                            <div className="bg_caption_recipe d-flex align-items-center">
                                <h1 className="caption_recipe font_text">
                                    {this.props.recipe.Name}
                                </h1>
                            </div>
                        </Card.ImgOverlay>
                    </Card>

                    <h3 className="mt-2 mb-1 font_text" style={{color:"#f3a42d"}}>INTRODUCTION</h3> 
                    <p style={{ fontSize: '18px', fontFamily: 'Lato', textAlign:"justify" , whiteSpace:"pre-line"}}>
                       {this.props.recipe.Introduction}</p>

                    <h3 className="mt-4 mb-0 font_text" style={{color:"#f3a42d"}}>INGREDIENTS</h3>
                    <ListGroup variant="flush">
                        {this.props.recipe.Ingredients.map((i) =>
                            <ListGroup.Item className="px-0" key={i.ingr}>
                                <span style={{ fontSize: '18px', fontFamily: 'Lato' }}>&#8226; {i.ingr}, </span>
                                <span>{i.qty}</span>
                            </ListGroup.Item>)}
                    </ListGroup>

                    <Row className="mx-auto mt-4 mb-0 justify-content-between">
                        <h3 className="my-auto font_text" style={{color:"#f3a42d"}}>PREPARATION</h3>
                        <Button variant="link" className="ml-4 px-0" onClick={() => { this.setShow() }}>
                            <Badge pill className="py-1" style={{borderColor: 'black', borderStyle:'solid', borderWidth: '1px', color:'white'}}>
                                <span style={{fontSize: '15px', color: '#f3a42d'}}>Listen</span>
                                <i className="fas fa-volume-up ml-2" style={{color: '#f3a42d'}}></i>
                            </Badge>
                        </Button>
                    </Row>
                    {this.props.recipe.Preparation.map((i) =>
                        <div className="mx-auto" key={i.txt}>
                            <hr className="my-1"></hr>
                            <h5>Step {i.index + 1}</h5>
                            <Row className="justify-content-center mx-auto mt-2">
                                {i.pic2 
                                    ? <>
                                        <Col xs={6} className="px-0"><Image src={i.pic1} style={{width:'100%', borderRightStyle: 'solid', borderWidth: '1px', borderColor: 'white'}}/></Col>
                                        <Col xs={6} className="px-0"><Image src={i.pic2} style={{width:'100%', borderLeftStyle: 'solid', borderWidth: '1px', borderColor: 'white'}}/></Col>
                                      </> 
                                    : <Image src={this.props.recipe.Covers.cover} style={{width:'70%'}}/>}
                            </Row>
                            <p style={{ fontSize: '18px', fontFamily: 'Lato', textAlign:"justify" , whiteSpace:"pre-line"}}>{i.txt}</p>
                        </div>)}

                    <Row className="justify-content-center">
                        <Link to="/"><Button style={{ backgroundColor: "grey", borderColor: "grey", fontFamily: 'Lato' }} className="my-4" size="lg">Back to Home</Button></Link>                    
                    </Row>
                </>

);
        }

    }
}

export default RecipeElement;