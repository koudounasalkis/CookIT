import React from 'react';

import { Button, Col, Image, Modal, Row, Badge } from 'react-bootstrap';


class FilterModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            applyButtonStatus: false,
            filterChoices: {
                TimePreparation: [],
                Diet: [],
                Meal: []
            },
            tempFilterChoices: {
                TimePreparation: [],
                Diet: [],
                Meal: []
            },
        }
    }

    componentDidMount = () => {
        this.setState({
            filterChoices: {
                TimePreparation: this.props.filterChoices.TimePreparation,
                Diet: this.props.filterChoices.Diet,
                Meal: this.props.filterChoices.Meal
            },
            tempFilterChoices: {
                TimePreparation: this.props.filterChoices.TimePreparation,
                Diet: this.props.filterChoices.Diet,
                Meal: this.props.filterChoices.Meal
            }
        });
    }

    setShow = () => {
        this.setState({ show: !this.state.show });
    }

    handleApplyButton = () => {
        this.setState({
            show: !this.state.show,
            filterChoices: {
                TimePreparation: this.state.tempFilterChoices.TimePreparation,
                Diet: this.state.tempFilterChoices.Diet,
                Meal: this.state.tempFilterChoices.Meal
            }
        });
        this.props.setFilterChoices(this.state.filterChoices);
        if (this.state.filterChoices["TimePreparation"].length === 0
            && this.state.filterChoices["Meal"].length === 0
            && this.state.filterChoices["Diet"].length === 0)
            this.setState({ applyButtonStatus: false });
    }

    updateFilterChoices = (filter, type) => {
        let filterCopy = this.state.tempFilterChoices;
        if (filterCopy[type].includes(filter)) {
            filterCopy[type].splice(filterCopy[type].indexOf(filter), 1);
        }
        else {
            if (type === 'TimePreparation') {
                filterCopy[type] = [];
            }
            if (type === 'Meal') {
                filterCopy[type] = [];
            }
            filterCopy[type].push(filter);
        }
        this.setState({ tempFilterChoices: filterCopy });
    }

    render() {
        return (
            <>
                <Button variant='link' className="p-0" onClick={() => this.setShow()}>
                    <i className="fas fa-filter fa-lg my-auto mr-1" />
                    <h6 style={{ fontSize: '11px', margin: '0px' }}>Filter</h6>
                    <h6 style={{ fontSize: '11px', margin: '0px', marginTop: '-4px' }}>recipes</h6>
                </Button>

                <Modal show={this.state.show} centered onHide={() => this.setShow()} onShow={() =>
                    this.setState({
                        applyButtonStatus: false,
                        tempFilterChoices: {
                            TimePreparation: this.state.filterChoices.TimePreparation,
                            Diet: this.state.filterChoices.Diet,
                            Meal: this.state.filterChoices.Meal
                        }
                    })}>

                    <Modal.Header closeButton onClick={() => this.setShow()}>
                        <Modal.Title className="font_text"> Filter by </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="px-2">
                        <h3 className="ml-2"> Time preparation </h3>
                        <Row className="justify-content-between mx-3 mb-3 font_text">
                            <Button variant="link">
                                <Image src="icons/filter/15min.png"
                                    width={this.state.tempFilterChoices["TimePreparation"].includes('15') ? 65 : 60}
                                    height={this.state.tempFilterChoices["TimePreparation"].includes('15') ? 65 : 60}
                                    style={this.state.tempFilterChoices["TimePreparation"].includes('15') ? { border: "3px solid green" } : {}}
                                    roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('15', 'TimePreparation')) }} />
                            </Button>
                            <Button variant="link">
                                <Image src="icons/filter/30min.png"
                                    width={this.state.tempFilterChoices["TimePreparation"].includes('30') ? 65 : 60}
                                    height={this.state.tempFilterChoices["TimePreparation"].includes('30') ? 65 : 60}
                                    style={this.state.tempFilterChoices["TimePreparation"].includes('30') ? { border: "3px solid green" } : {}}
                                    roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('30', 'TimePreparation')) }} />
                            </Button>
                            <Button variant="link">
                                <Image src="icons/filter/45min.png"
                                    width={this.state.tempFilterChoices["TimePreparation"].includes('45') ? 65 : 60}
                                    height={this.state.tempFilterChoices["TimePreparation"].includes('45') ? 65 : 60}
                                    style={this.state.tempFilterChoices["TimePreparation"].includes('45') ? { border: "3px solid green" } : {}}
                                    roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('45', 'TimePreparation')) }} />
                            </Button>
                        </Row>
                        <h3 className="ml-2 ">Diet</h3>
                        <Row className="justify-content-between mx-4 font_text">
                            <Col className="text-center">
                                <Button variant="link">
                                    <Image src="icons/filter/vegetarian.png"
                                        width={this.state.tempFilterChoices["Diet"].includes('Vegetarian') ? 65 : 60}
                                        height={this.state.tempFilterChoices["Diet"].includes('Vegetarian') ? 65 : 60}
                                        style={this.state.tempFilterChoices["Diet"].includes('Vegetarian') ? { border: "3px solid green" } : {}}
                                        roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('Vegetarian', 'Diet')) }} />
                                </Button>
                                <div className="font_text"><Badge pill variant="secondary"> Vegetarian </Badge></div>
                            </Col>
                            <Col className="text-center">
                                <Button variant="link">
                                    <Image src="icons/filter/vegan.png"
                                        width={this.state.tempFilterChoices["Diet"].includes('Vegan') ? 65 : 60}
                                        height={this.state.tempFilterChoices["Diet"].includes('Vegan') ? 65 : 60}
                                        style={this.state.tempFilterChoices["Diet"].includes('Vegan') ? { border: "3px solid green" } : {}}
                                        roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('Vegan', 'Diet')) }} />
                                </Button>
                                <div className="font_text"><Badge pill variant="secondary"> Vegan </Badge></div>
                            </Col>
                        </Row>
                        <Row className="justify-content-between mx-4 mt-2 mb-3">
                            <Col className="text-center">
                                <Button variant="link">
                                    <Image src="icons/filter/glutenFree.png"
                                        width={this.state.tempFilterChoices["Diet"].includes('Gluten-free') ? 65 : 60}
                                        height={this.state.tempFilterChoices["Diet"].includes('Gluten-free') ? 65 : 60}
                                        style={this.state.tempFilterChoices["Diet"].includes('Gluten-free') ? { border: "3px solid green" } : {}}
                                        roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('Gluten-free', 'Diet')) }} />
                                </Button>
                                <div className="font_text"><Badge pill variant="secondary"> Gluten Free </Badge></div>
                            </Col>
                            <Col className="text-center">
                                <Button variant="link">
                                    <Image src="icons/filter/lactoseFree.png"
                                        width={this.state.tempFilterChoices["Diet"].includes('Lactose-free') ? 65 : 60}
                                        height={this.state.tempFilterChoices["Diet"].includes('Lactose-free') ? 65 : 60}
                                        style={this.state.tempFilterChoices["Diet"].includes('Lactose-free') ? { border: "3px solid green" } : {}}
                                        roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('Lactose-free', 'Diet')) }} />
                                </Button>
                                <div className="font_text"><Badge pill variant="secondary"> Lactose Free </Badge></div>
                            </Col>
                        </Row>
                        <h3 className="ml-2">Meal</h3>
                        <Row className="justify-content-between">
                            <Col className="text-center">
                                <Button variant="link">
                                    <Image src="icons/filter/firstDishes.png"
                                        width={this.state.tempFilterChoices["Meal"].includes('First Dishes') ? 65 : 60}
                                        height={this.state.tempFilterChoices["Meal"].includes('First Dishes') ? 65 : 60}
                                        style={this.state.tempFilterChoices["Meal"].includes('First Dishes') ? { border: "3px solid green" } : {}}
                                        roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('First Dishes', 'Meal')) }} />
                                </Button>
                                <div className="font_text"><Badge pill variant="secondary"> First dishes </Badge></div>
                            </Col>
                            <Col className="text-center">
                                <Button variant="link">
                                    <Image src="icons/filter/mainCourses.png"
                                        width={this.state.tempFilterChoices["Meal"].includes('Main Courses') ? 65 : 60}
                                        height={this.state.tempFilterChoices["Meal"].includes('Main Courses') ? 65 : 60}
                                        style={this.state.tempFilterChoices["Meal"].includes('Main Courses') ? { border: "3px solid green" } : {}}
                                        roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('Main Courses', 'Meal')) }} />
                                </Button>
                                <div className="font_text"><Badge pill variant="secondary"> Main courses </Badge></div>
                            </Col>
                            <Col className="text-center">
                                <Button variant="link">
                                    <Image src="icons/filter/dessert.png"
                                        width={this.state.tempFilterChoices["Meal"].includes('Desserts') ? 65 : 60}
                                        height={this.state.tempFilterChoices["Meal"].includes('Desserts') ? 65 : 60}
                                        style={this.state.tempFilterChoices["Meal"].includes('Desserts') ? { border: "3px solid green" } : {}}
                                        roundedCircle={true} onClick={() => { this.setState({ applyButtonStatus: true }, () => this.updateFilterChoices('Desserts', 'Meal')) }} />
                                </Button>
                                <div className="font_text"><Badge pill variant="secondary"> Desserts </Badge></div>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer className="font_text">
                        <Button variant="success" size="lg" block
                            disabled={this.state.applyButtonStatus ? false : true}
                            onClick={this.handleApplyButton}> Apply </Button>
                    </Modal.Footer>

                </Modal>
            </>
        );
    }
}

export default FilterModal;