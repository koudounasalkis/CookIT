import React from 'react';

import { Row, Card } from 'react-bootstrap';

import IngredientsList from './IngredientsList';

let categories = [
    ["/PhotosCategories/BasicIngredients.png", "Basic Ingredients"],
    ["/PhotosCategories/CheeseDairyProducts.png", "Cheese and dairy products"],
    ["/PhotosCategories/ColdCuts.png", "Cold cuts"],
    ["/PhotosCategories/Condiments.png", "Condiments"],
    ["/PhotosCategories/Fish.png", "Fish"],
    ["/PhotosCategories/Fruit.png", "Fruit"],
    ["/PhotosCategories/Jam.png", "Jam"],
    ["/PhotosCategories/Legumes.png", "Legumes"],
    ["/PhotosCategories/Meat.png", "Meat"],
    ["/PhotosCategories/Pasta.png", "Pasta, Cereals and Tubers"],
    ["/PhotosCategories/Vegetables.png", "Vegetables"],
]


class InsertionCategory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        if (this.props.category.length === 0) {
            return (
                <>
                    <Row>
                    <h4 className='my-2 ml-3 font_text' style={{ fontWeight: 'bold',color: '#f3a42d' }}>SELECT CATEGORY</h4>
                        {categories.map((c) =>
                            <div key={c[1]}>
                                <hr style={{ color: 'gray' }}/>
                                <Row className='mt-2 mx-2' onClick={() => this.props.setCategory(c[1])}>
                                    <Card >
                                        <Card.Img className='rounded mb-0 ml-2 mx-auto' src={c[0]} style={{ width: '100%', borderWeight: 'solid', borderColor: '#adadad' }}/>
                                        <Card.ImgOverlay style={{width:'60%', marginRight:'0px', marginLeft:'auto', paddingRight: '10px', textAlign: 'end'}}>
                                            <h5 className='font_text my-5' style={{ fontWeight: 'bold' }}>{c[1]}</h5>
                                        </Card.ImgOverlay>
                                    </Card>
                                </Row>
                            </div>)}
                    </Row>
                </>
            );
        } else {
            return (
                <IngredientsList ingredients={this.props.ingredients} category={this.props.category} addIngredient={this.props.addIngredient} />
            );
        }
    }
}


export default InsertionCategory;
