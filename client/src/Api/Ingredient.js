class Ingredient { 
       
    constructor(Name, Category, LastTimestamp, Photo) {
        this.Name = Name;
        this.Category = Category;
        this.LastTimestamp = LastTimestamp;
        this.Photo = Photo;
    }

    /**
     * Construct an Ingredient element from a plain object
     * @param {{}} json 
     * @return {Ingredient} the newly created Ingredient object
     */
    static from(json) {
        const ingredient = Object.assign(new Ingredient(), json);
        return ingredient;
    }
}
  
export default Ingredient;