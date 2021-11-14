class Recipe {    
    
    constructor(Name, Covers, Difficulty, Portion, TimePreparation, Diet, Meal, Favourite, LastTimestamp, Introduction, Ingredients, Preparation) {
        this.Name = Name;
        this.Covers = JSON.parse(Covers);
        this.Difficulty = Difficulty;
        this.Portion = Portion;
        this.TimePreparation = TimePreparation;
        this.Diet = Diet;
        this.Meal = Meal;
        this.Favourite = Favourite;
        this.LastTimestamp = LastTimestamp;
        this.Introduction =Introduction;
        this.Ingredients = JSON.parse(Ingredients);
        this.Preparation = JSON.parse(Preparation);
    }

    /**
     * Construct a Recipe element from a plain object
     * @param {{}} json 
     * @return {Recipe} the newly created Recipe object
     */
    static from(json) {
        const recipe = Object.assign(new Recipe(), json);
        return recipe;
    }
}
  
export default Recipe;