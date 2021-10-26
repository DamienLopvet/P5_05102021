/**
 * Prepare the class to assign each product instance        
 */
class Product{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
     
    }
}
