import React from 'react';
import './App.css';

// Import js files
import API from './Api/API'
import FilterModal from './Components/FilterModal';
import InsertionBar from './Components/InsertionBar';
import IngredientsList from './Components/IngredientsList';
import InsertionCamera from './Components/InsertionCamera';
import InsertionCategory from './Components/InsertionCategory';
import Loading from './Components/Loading';
import NavBar from './Components/NavBar';
import RecipeElement from './Components/RecipeElement';
import RecipesList from './Components/RecipesList';

// Import bootstrap-react
import { Container, Image, ListGroup, Row } from 'react-bootstrap';

// Import react-router-dom
import { Link, NavLink } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      location: 'Home',
      showNavbar: true,
      recipes: [],
      category: '',
      lastRecipes: [],
      favouriteRecipes: [],
      filteredRecipes: [],
      ingredients: [],
      lastIngredients: [],
      text: [],
      suggestedIngredients: [],
      insertedIngredients: [],
      chosenRecipe: {},
      filterChoices: {
        TimePreparation: [],
        Diet: [],
        Meal: []
      },
      errorMsg: '',      // Error message received by an API call
      fullScreen: false,
      firstTimeFilter: true
    }
  }

  componentDidMount() {
    window.document.onfullscreenchange = () => this.setState({ fullScreen: !this.state.fullScreen });
    function updateWindowSize() {
      window.lastInnerWidth = window.innerWidth;
      window.lastInnerHeight = window.innerHeight;
      window.lastOrientation = window.orientation;
      // Stays the same for iOS, so that's our ticket to detect iOS keyboard
      window.lastBodyHeight = document.body.clientHeight;
    };

    function detectKeyboard() {
      function orientationChange() {
        if (((window.lastOrientation === 0 || window.lastOrientation === 180) && (window.orientation === 0 || window.orientation === 180)) || ((window.lastOrientation === 90 || window.lastOrientation === -90) && (window.orientation === 90 || window.orientation === -90))) return false
        else return true;
      }

      var keyboardHeight;

      // No orientation change, keyboard opening
      if ((window.lastInnerHeight - window.innerHeight > 150) && window.innerWidth === window.lastInnerWidth) {
        keyboardHeight = window.lastInnerHeight - window.innerHeight;
        updateWindowSize();
        localStorage.setItem('firstTime', JSON.stringify(false));
        return keyboardHeight;
      }
      // Orientation change with keyboard already opened
      if (orientationChange() && document.body.classList.contains("keyboard-open")) {
        keyboardHeight = window.screen.height - window.topBarHeight - window.innerHeight;
        updateWindowSize();
        return keyboardHeight;
      }

      // No orientation change, keyboard closing
      if ((window.innerHeight - window.lastInnerHeight > 150) && window.innerWidth === window.lastInnerWidth) {
        keyboardHeight = -1;
        updateWindowSize();
        return keyboardHeight;
      }

      // Orientation change or regular resize, no keyboard action
      keyboardHeight = 0;
      updateWindowSize();
      return keyboardHeight;
    };

    function keyboardShift(keyboardHeight) {
      if (!document.body.classList.contains("keyboard-open")) document.body.classList.add("keyboard-open");
      document.body.setAttribute("style", "height: calc(100% + " + keyboardHeight + "px);");
    };

    function removeKeyboardShift() {
      document.body.classList.remove("keyboard-open");
      document.body.removeAttribute("style");
    };

    // OnStart innit
    (function () {
      updateWindowSize();
      window.topBarHeight = window.screen.height - window.innerHeight;
      window.addEventListener("resize", resizeThrottler, false);

      var resizeTimeout;
      function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
          resizeTimeout = setTimeout(function () {
            resizeTimeout = null;
            actualResizeHandler();
            // The actualResizeHandler will execute at a rate of 15fps
          }, 66);
        }
      }

      function actualResizeHandler() {
        var keyboardHeight = detectKeyboard();
        if (keyboardHeight > 0) { keyboardShift(keyboardHeight); }
        else if (keyboardHeight === -1) { removeKeyboardShift(); }
      }
    }());

    if (localStorage.getItem('firstTimeFilter') === 'false') this.setState({ firstTimeFilter: false })
    let recipe = localStorage.getItem('chosenRecipe');
    let ingredients_vec = JSON.parse(localStorage.getItem('insertedIngredients'));
    API.getRecipes()
      .then((recipes) => {
        recipes.sort((a, b) => b.LastTimestamp - a.LastTimestamp);
        let previouslyChosenRecipe = recipes.filter((r) => r.Name === recipe);
        this.setState({
          recipes: recipes,
          filteredRecipes: recipes,
          favouriteRecipes: recipes.filter((r) => r.Favourite === 1).sort((a, b) => a.Name.localeCompare(b.Name)),
          lastRecipes: recipes.filter((r) => r.LastTimestamp !== null),
          loading: false,
          chosenRecipe: previouslyChosenRecipe[0],
        })
      }).catch((errorObj) => this.handleErrors(errorObj));

    API.getIngredients()
      .then((ingredients) => {
        ingredients.sort((a, b) => b.LastTimestamp - a.LastTimestamp);
        let previouslyInsertedIngredients;
        if (ingredients_vec) {
          previouslyInsertedIngredients = ingredients.filter((i) => ingredients_vec.includes(i.Name));
        } else previouslyInsertedIngredients = [];
        this.setState({
          ingredients: ingredients,
          lastIngredients: ingredients.filter((i) => i.LastTimestamp !== null),
          loading: false,
          insertedIngredients: previouslyInsertedIngredients
        })
      })
      .catch((errorObj) => this.handleErrors(errorObj));
  }

  componentDidUpdate() {
    if (this.state.insertedIngredients.length !== 0 && window.location.pathname === '/') {
      this.setState({ insertedIngredients: [], showNavbar: true, suggestedIngredients: [], text: '' });
    }
  }

  handleErrors = (errorObj) => {
    if (errorObj) {
      console.log(errorObj)
      const err0 = errorObj.errors[0];
      const errorString = err0.param + ': ' + err0.msg;
      this.setState({ errorMsg: errorString });
    }
  }

  setLocation = (location) => {
    this.setState({ location: location });
  }

  updateKeyboardField = (name, value) => {
    this.setState({ [name]: value }, () => this.checkList());
  }

  setCategory = (category) => {
    this.setState({ category: category });
  }

  checkList = () => {
    if (this.state.text.length !== 0) {
      let lowered = this.state.text.charAt(0).toLowerCase() + this.state.text.slice(1);
      let ing = this.state.ingredients.filter((i) => {
        let ingredient = i.Name.toLowerCase();
        return ingredient.includes(this.state.text.toLowerCase());
      });
      ing.sort((a, b) => {
        let wordsA = a.Name.split(" ");
        let wordsB = b.Name.split(" ");
        let indA = 999;
        let indB = 999;
        for (let i = 0; i < wordsA.length; i++) {
          let tempAU = wordsA[i].toLowerCase().indexOf(lowered);
          tempAU = tempAU < 0 ? 999 : tempAU;
          if (tempAU < indA) {
            indA = tempAU;
          }
        }
        for (let i = 0; i < wordsB.length; i++) {
          let tempBL = wordsB[i].toLowerCase().indexOf(lowered);
          tempBL = tempBL < 0 ? 999 : tempBL;
          if (tempBL < indB) {
            indB = tempBL;
          }
        }
        if (indA < indB) return -1;
        else return 1;
      });
      let ing1 = ing.slice(0, 4);
      ing1.sort((a, b) => a.Name.length - b.Name.length);
      if (ing1.length === 0) ing1.push("none");
      this.setState({ suggestedIngredients: ing1 });
    } else
      this.setState({ suggestedIngredients: [] });
  }

  setSpeechToText = (transcript) => {
    this.setState({ text: transcript }, () => this.checkList());
  }

  addIngredient = (ingredient) => {
    let ingredients = [];
    if (this.state.insertedIngredients.length !== 0) {
      ingredients = [...this.state.insertedIngredients];
    } else if (JSON.parse(localStorage.getItem('insertedIngredients'))) {
      ingredients = this.state.ingredients.filter((i) => JSON.parse(localStorage.getItem('insertedIngredients')).includes(i.Name));
    }
    ingredients.push(ingredient);
    this.setState({ insertedIngredients: [...new Set(ingredients)], category: '' });
    localStorage.setItem('insertedIngredients', JSON.stringify(ingredients.map((i) => i.Name)));
  }

  deleteIngredient = (ingredient) => {
    let ingredients = [];
    if (this.state.insertedIngredients.length !== 0) {
      ingredients = [...this.state.insertedIngredients];
    } else if (JSON.parse(localStorage.getItem('insertedIngredients'))) {
      ingredients = this.state.ingredients.filter((i) => JSON.parse(localStorage.getItem('insertedIngredients')).includes(i.Name));
    }
    var filtered = ingredients.filter((i) => i.Name !== ingredient.Name);
    this.setState({ insertedIngredients: filtered });
    localStorage.setItem('insertedIngredients', JSON.stringify(filtered.map((i) => i.Name)));
  }

  setChosenRecipe = (recipe) => {
    this.setState({ chosenRecipe: recipe });
  }

  setFilterChoices = (choices) => {
    this.setState({
      filterChoices: {
        TimePreparation: choices.TimePreparation,
        Diet: choices.Diet,
        Meal: choices.Meal
      }
    })
  }

  /*updateFilterChoices = (filter, type) => {
    let filterCopy = this.state.filterChoices;
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
    this.setState({ filterChoices: filterCopy });
  }*/

  clearFilterChoices = () => {
    this.setState({
      filterChoices: {
        TimePreparation: [],
        Diet: [],
        Meal: []
      }
    }, () => this.filterRecipes());
  }

  filterRecipes = (res) => {
    let filteredRecipes = [...this.state.recipes];
    let filterTime = filteredRecipes.filter((r) => r.TimePreparation <= this.state.filterChoices["TimePreparation"][0]);
    let filterDiet = filteredRecipes.filter((r) => r.Diet.includes(this.state.filterChoices["Diet"]));
    let filterMeal = filteredRecipes.filter((r) => r.Meal === this.state.filterChoices["Meal"][0]);
    if (this.state.filterChoices["TimePreparation"].length !== 0 && this.state.filterChoices["Diet"].length !== 0 && this.state.filterChoices["Meal"].length !== 0) {
      let filterTimeDiet = filterTime.filter(value => filterDiet.includes(value));
      let filterAll = filterTimeDiet.filter(value => filterMeal.includes(value));
      if (res) return filterAll; else this.setState({ filteredRecipes: filterAll });
    } else if (this.state.filterChoices["TimePreparation"].length !== 0 && this.state.filterChoices["Diet"].length !== 0) {
      let filterTimeDiet = filterTime.filter(value => filterDiet.includes(value));
      if (res) return filterTimeDiet; else this.setState({ filteredRecipes: filterTimeDiet });
    } else if (this.state.filterChoices["TimePreparation"].length !== 0 && this.state.filterChoices["Meal"].length !== 0) {
      let filterTimeMeal = filterTime.filter(value => filterMeal.includes(value));
      if (res) return filterTimeMeal; else this.setState({ filteredRecipes: filterTimeMeal });
    } else if (this.state.filterChoices["Diet"].length !== 0 && this.state.filterChoices["Meal"].length !== 0) {
      let filterDietMeal = filterDiet.filter(value => filterMeal.includes(value));
      if (res) return filterDietMeal; else this.setState({ filteredRecipes: filterDietMeal });
    } else if (this.state.filterChoices["TimePreparation"].length !== 0) {
      if (res) return filterTime; else this.setState({ filteredRecipes: filterTime });
    } else if (this.state.filterChoices["Diet"].length !== 0) {
      if (res) return filterDiet; else this.setState({ filteredRecipes: filterDiet });
    } else if (this.state.filterChoices["Meal"].length !== 0) {
      if (res) return filterMeal; else this.setState({ filteredRecipes: filterMeal });
    } else {
      this.setState({ filteredRecipes: this.state.recipes });
    }
  }

  setRecipe = (chosenRecipe) => {
    let today = new Date();
    let month = today.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let date = today.getDate();
    date = date < 10 ? "0" + date : date;
    let hours = today.getHours();
    hours = hours < 10 ? "0" + hours : hours;
    let minutes = today.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let seconds = today.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;
    today = parseInt(today.getUTCFullYear().toString() + month.toString() + date.toString() + hours.toString() + minutes.toString() + seconds.toString());
    API.updateTimestampRecipe(today, chosenRecipe).then(() => {
      this.recursiveIngredientsUpdate(today, this.state.insertedIngredients);
    });
  }

  recursiveIngredientsUpdate = (today, insertedIngredients) => {
    if (insertedIngredients.length !== 0) {
      API.updateTimestampIngredient(today, insertedIngredients[insertedIngredients.length - 1].Name).then(() => {
        insertedIngredients.pop();
        if (insertedIngredients.length !== 0) this.recursiveIngredientsUpdate(today, insertedIngredients);
        else this.updatelists(true);
      }).catch((error) => this.handleErrors(error));
    } else this.updatelists(false);
  }

  updatelists = (ingredientsInNeed) => {
    API.getRecipes()
      .then((recipes) => {
        recipes.sort((a, b) => b.LastTimestamp - a.LastTimestamp);
        if (ingredientsInNeed) {
          API.getIngredients()
            .then((ingredients) => {
              ingredients.sort((a, b) => b.LastTimestamp - a.LastTimestamp);
              this.setState({
                ingredients: ingredients,
                lastIngredients: ingredients.filter((i) => i.LastTimestamp !== null),
                recipes: recipes,
                favouriteRecipes: recipes.filter((r) => r.Favourite === 1).sort((a, b) => a.Name.localeCompare(b.Name)),
                lastRecipes: recipes.filter((r) => r.LastTimestamp !== null),
                filteredRecipes: recipes
              })
            })
            .catch((errorObj) => this.handleErrors(errorObj));
        } else {
          this.setState({
            recipes: recipes,
            favouriteRecipes: recipes.filter((r) => r.Favourite === 1).sort((a, b) => a.Name.localeCompare(b.Name)),
            lastRecipes: recipes.filter((r) => r.LastTimestamp !== null),
            filteredRecipes: recipes
          })
        }
      })
      .catch((errorObj) => this.handleErrors(errorObj));
  }

  updateIngredients = () => {
    API.getIngredients()
      .then((ingredients) => {
        ingredients.sort((a, b) => b.LastTimestamp - a.LastTimestamp);
        this.setState({
          ingredients: ingredients,
          lastIngredients: ingredients.filter((i) => i.LastTimestamp !== null),
        })
      })
      .catch((errorObj) => this.handleErrors(errorObj));
  }

  chooseAdvice = (i) => {
    this.addIngredient(i);
    if (this.state.text.length !== 0) this.setState({ text: [] }, () => this.checkList());
  }

  toggleFirstTimeFilter = () => {
    localStorage.setItem('firstTimeFilter', JSON.stringify(false));
    this.setState({ firstTimeFilter: false });
  }

  render() {
    return (
      <>
        <Router>
          {this.state.loading ? <Loading /> : <>
            <Container fluid >

              <Switch>

                <Route exact path="/" render={(props) => {
                  localStorage.removeItem('insertedIngredients');
                  localStorage.removeItem('chosenRecipe');
                  return (
                    <>
                      {this.state.showNavbar
                        ? <NavBar location={"Home"} setLocation={this.setLocation} toggleFullScreen={this.toggleFullScreen} />
                        : <h6 className="font_text mt-2" style={{ marginLeft: '40%', color: '#f3a42d' }}>CookIT</h6>}
                      <InsertionBar updateKeyboardField={this.updateKeyboardField} text={this.state.text} advices={this.state.suggestedIngredients} chooseAdvice={this.chooseAdvice} setSpeechToText={this.setSpeechToText} />
                      {this.state.suggestedIngredients.length !== 0 &&
                        <ListGroup style={{ borderRadius: '15px', width: '47%', fontFamily: 'Lato', marginTop: '-7.2px', marginLeft: '19px' }} className="keyboardListGroup">
                          {this.state.suggestedIngredients[0] !== "none" ?
                            this.state.suggestedIngredients.slice(0, 4).map((i) =>
                              <Link to="/results" key={i.Name} style={{ color: ' #6d4304' }}>
                                <ListGroup.Item onClick={(ev) => { this.chooseAdvice(i) }}>
                                  {i.Name}
                                </ListGroup.Item></Link>) :
                            <ListGroup.Item>{"No results"}</ListGroup.Item>}
                        </ListGroup>}
                      <div className="mt-3 lists">
                        <Link to={"/last_recipes"} style={{ textDecoration: 'none' }}>
                          <Row className="font_text mx-auto ">
                            <h4 className="mr-1">Last Recipes</h4>
                            <Image className="pb-2 pl-1 mr-5" src="icons/timer.svg" width="30" heigth="30" />
                            <i className="fas fa-chevron-right fa-1x pb-1 my-auto" style={{ color: '#f3a42d', fontSize: '25px', marginLeft: 'auto', marginRight: '20px' }} />
                          </Row>
                        </Link>
                        <RecipesList recipes={this.state.lastRecipes} setChosenRecipe={this.setChosenRecipe} destination="/last_recipes"
                          setLocation={this.setLocation} setRecipe={this.setRecipe} insertedIngredients={this.state.insertedIngredients} />
                        { }
                        <NavLink to={"/favorite_recipes"} style={{ textDecoration: 'none' }}>
                          <Row className="font_text mx-auto mt-4">
                            <h4 className="mr-1 mt-2" >Favorite Recipes</h4>
                            <Image className="pb-2 pl-1 mr-5 mt-1" src="icons/like.svg" width="28" heigth="28" />
                            <i className="fas fa-chevron-right fa-1x pb-1 my-auto pl-1" style={{ color: '#f3a42d', fontSize: '25px', marginLeft: 'auto', marginRight: '20px' }} />
                          </Row>
                        </NavLink>
                        <RecipesList recipes={this.state.favouriteRecipes} setChosenRecipe={this.setChosenRecipe} destination="/favorite_recipes" setRecipe={this.setRecipe} insertedIngredients={this.state.insertedIngredients} />
                        { }
                        <Link to={"/last_ingredients"} style={{ textDecoration: 'none' }}>
                          <Row className="font_text mx-auto mt-4">
                            <h4 className="mr-1 mt-2">Last Ingredients</h4>
                            <Image className="pb-2 pl-1 mr-5 mt-1" src="icons/timer.svg" width="30" heigth="30" />
                            <i className="fas fa-chevron-right fa-1x pb-1 my-auto pl-1" style={{ color: '#f3a42d', fontSize: '25px', marginLeft: 'auto', marginRight: '20px' }} />
                          </Row>
                        </Link>
                        <IngredientsList ingredients={this.state.lastIngredients} addIngredient={this.addIngredient} addFavorite={this.addFavorite} destination="/last_ingredients" />
                      </div>
                    </>
                  );
                }} />

                <Route exact path="/last_recipes" render={(props) => {
                  return (
                    <>
                      <NavBar location={'Last Recipes'} setLocation={this.setLocation} />
                      <div className="lists">
                        <Row className="mx-auto">
                          <h4 className="font_text" style={{ fontWeight: 'bold', color: ' #f3a42d' }}>LAST RECIPES</h4>
                          <Image className="pb-2 pl-1" src="icons/timer.svg" width="30" heigth="30" />
                        </Row>
                        <RecipesList recipes={this.state.lastRecipes} setChosenRecipe={this.setChosenRecipe} setRecipe={this.setRecipe} insertedIngredients={this.state.insertedIngredients} location={'LastRecipes'} />
                      </div>
                    </>
                  );
                }} />

                <Route exact path="/favorite_recipes" render={(props) => {
                  return (
                    <>
                      <NavBar location={'Favorite Recipes'} setLocation={this.setLocation} />
                      <div className="lists">
                        <Row className="mx-auto">
                          <h4 className="font_text" style={{ fontWeight: 'bold', color: ' #f3a42d' }}>FAVORITE RECIPES</h4>
                          <Image className="pb-2 pl-1" src="icons/like.svg" width="30" heigth="30"></Image>
                        </Row>
                        <RecipesList recipes={this.state.favouriteRecipes} setChosenRecipe={this.setChosenRecipe} setRecipe={this.setRecipe} insertedIngredients={this.state.insertedIngredients} location={'FavRecipes'} />
                      </div>
                    </>
                  );
                }} />

                <Route exact path="/last_ingredients" render={(props) => {
                  return (
                    <>
                      <NavBar location={'Last Ingredients'} setLocation={this.setLocation} />
                      <div className="lists">
                        <Row className="mx-auto">
                          <h4 className="font_text" style={{ fontWeight: 'bold', color: ' #f3a42d' }}>LAST INGREDIENTS</h4>
                          <Image className="pb-2 pl-1" src="icons/timer.svg" width="30" heigth="30"></Image>
                        </Row>
                        <IngredientsList ingredients={this.state.lastIngredients} addIngredient={this.addIngredient} />
                      </div>
                    </>
                  );
                }} />

                <Route exact path='/results' render={(props) => {
                  let passedIngredients;
                  if (this.state.insertedIngredients.length !== 0) {
                    passedIngredients = this.state.insertedIngredients;
                  } else {
                    passedIngredients = this.state.ingredients.filter((i) => JSON.parse(localStorage.getItem('insertedIngredients')).includes(i.Name));
                  }
                  let filtered;
                  if (this.state.filteredRecipes.length === this.state.recipes.length &&
                    (this.state.filterChoices.Meal.length !== 0 ||
                      this.state.filterChoices.TimePreparation.length !== 0 ||
                      this.state.filterChoices.Diet.length !== 0)) {
                    filtered = this.filterRecipes(true);
                  }
                  return (
                    <>
                      <NavBar location={'Results'} setLocation={this.setLocation} clearFilterChoices={this.clearFilterChoices} />
                      <InsertionBar updateKeyboardField={this.updateKeyboardField} text={this.state.text} advSize={this.state.suggestedIngredients.length} chooseAdvice={this.chooseAdvice} setSpeechToText={this.setSpeechToText} />
                      {this.state.suggestedIngredients.length !== 0 &&
                        <ListGroup style={{ borderRadius: '15px', width: '47%', fontFamily: 'Lato', marginTop: '-7.2px', marginLeft: '19px' }} className="keyboardListGroup">
                          {this.state.suggestedIngredients[0] !== "none" ?
                            this.state.suggestedIngredients.slice(0, 4).map((i) =>
                              <Link to="/results" key={i.Name} style={{ color: ' #6d4304' }}>
                                <ListGroup.Item onClick={(ev) => { this.chooseAdvice(i) }}>
                                  {i.Name}
                                </ListGroup.Item></Link>) :
                            <ListGroup.Item>{"No results"}</ListGroup.Item>}
                        </ListGroup>}
                      <div className="mt-3 lists">
                        <Row className="justify-content-between mx-auto">
                          <h2 className="font_text">Recipes with:</h2>
                          <FilterModal filterChoices={this.state.filterChoices} setFilterChoices={this.setFilterChoices} clearFilterChoices={this.clearFilterChoices} filterRecipes={this.filterRecipes} />
                        </Row>
                        <IngredientsList inserted={true} ingredients={passedIngredients} deleteIngredient={this.deleteIngredient} clearFilterChoices={this.clearFilterChoices} />
                        <RecipesList recipes={filtered ? filtered : this.state.filteredRecipes} updateRecipes={this.updateRecipes} setChosenRecipe={this.setChosenRecipe}
                          insertedIngredients={passedIngredients} setRecipe={this.setRecipe} location={'Results'} />
                      </div>
                    </>
                  );
                }} />

                <Route exact path='/recipe' render={(props) => {
                  localStorage.setItem('chosenRecipe', this.state.chosenRecipe.Name);
                  return (
                    <>
                      <NavBar location={'Recipe'} setLocation={this.setLocation} />
                      <RecipeElement recipe={this.state.chosenRecipe} updatelists={this.updatelists} preview={false} setRecipe={this.setRecipe} />
                    </>
                  );
                }} />

                <Route exact path='/insertion_camera' render={(props) => {
                  return (
                    <>
                      <NavBar location={'Camera'} setLocation={this.setLocation} camera={true} />
                      <InsertionCamera spaghetti={this.state.ingredients.filter((i) => i.Name === 'Spaghetti')[0]} addIngredient={this.addIngredient} />
                    </>
                  );
                }} />

                <Route exact path='/insertion_category' render={(props) => {
                  return (
                    <>
                      <NavBar location={'Category'} setLocation={this.setLocation} setCategory={this.setCategory} category={this.state.category} />
                      <InsertionCategory ingredients={this.state.ingredients} category={this.state.category} setCategory={this.setCategory} addIngredient={this.addIngredient} />
                    </>
                  );
                }} />

                <Route>
                  <Redirect to='/' />
                </Route>

              </Switch>

            </Container>
          </>}
        </Router>
      </>
    );
  }
}


export default App;
