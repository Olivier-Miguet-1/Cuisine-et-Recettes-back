const IngredientService = require('../../services/IngredientService')
const UserService = require('../../services/UserService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_Ingredient_valid = ""
var tab_id_Ingredients = []
var tab_id_users = []
var Ingredients = []

var tab_id_users =[]
let users = [
    {
        firstName: "Détenteur de Ingrédient 1",
        lastName: "Iencli",
        username: "oui1",
        email:"iencli1@gmail.com",
            password: "12345"
    },
    {
        firstName: "Détenteur de Ingrédient 2",
        lastName: "Iencli",
        username: "oui2",
        email:"iencli2@gmail.com",
            password: "12345"
    },
    {
        firstName: "Détenteur de Ingrédient 3",
        lastName: "Iencli",
        username: "oui3",
        email:"iencli3@gmail.com",
            password: "12345"
    },
    {
        firstName: "Détenteur de Ingrédient 4",
        lastName: "Iencli",
        username: "oui4",
        email:"iencli4@gmail.com",
            password: "12345"
    },
];

it("Création des utilisateurs fictif", (done) => {
    UserService.addManyUsers(users,null, function (err, value) {
        tab_id_users = _.map(value, '_id')
        done()
    })
})

function rdm_user (tab) {
    let rdm_id = tab[Math.floor(Math.random() * (tab.length-1) )]
    return rdm_id
}

describe("addOneIngredient", (done) => {
    it("Ingrédient correct. - S", () => {
        var Ingredient = {
            name: "test",
            description: "ceci est une description",
            price: 10,
            quantity: 120,
            user_id: rdm_user(tab_id_users)
        }    
        IngredientService.addOneIngredient(Ingredient,null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            id_Ingredient_valid = value._id
            Ingredients.push(value)
            done()
        })
    })
    it("Ingrédient incorrect. (Sans name) - E", (done) => {
        var Ingredient_no_valid = {
            description: "ceci est une description",
            price: 11,
            quantity: 80,
            user_id: rdm_user(tab_id_users)
        }
        IngredientService.addOneIngredient(Ingredient_no_valid,null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("addManyIngredients", () => {
    it("Ingrédients à ajouter, valide. - S", (done) => {
        var Ingredients_tab = [{
            name: "Farine",
            description: "ceci est une description",
            price: 20,
            quantity: 20,
            user_id: rdm_user(tab_id_users)
        }, {
            name: "Oeufs",
            description: "ceci est une description",
            price: 10,
            quantity: 50,
            user_id: rdm_user(tab_id_users)
        },
        {
            name: "Sucre",
            description: "ceci est une description",
            price: 25,
            quantity: 8,
            user_id: rdm_user(tab_id_users)
        }]

        IngredientService.addManyIngredients(Ingredients_tab,null, function (err, value) {
            tab_id_Ingredients = _.map(value, '_id')
            Ingredients = [...value, ...Ingredients]
            expect(value).lengthOf(3)
            //console.log(value)
            done()
        })
    })
    it("Ingrédients à ajouter, non valide. - E", (done) => {
        var Ingredients_tab_error = [{
            name: "fourchette",
            description: "ceci est une description",
            price: -20,
            quantity: 20,
            user_id: rdm_user(tab_id_users)
        }, {
            name: "couteau",
            price: 12,
            quantity: -20,
            user_id: rdm_user(tab_id_users)
        },
        {
            name: "",
            description: "ceci est une description",
            price: 15,
            quantity: 20,
            user_id: rdm_user(tab_id_users)
        }]

        IngredientService.addManyIngredients(Ingredients_tab_error,null, function (err, value) {
            done()
        })
    })
})

describe("findOneIngredientById", () => {
    it("Chercher un ingrédient existant correct. - S", (done) => {
        IngredientService.findOneIngredientById(id_ingredient_valid,null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Chercher un ingrédient non-existant correct. - E", (done) => {
        IngredientService.findOneIngredientById("100",null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyIngredientsById", () => {
    it("Chercher des ingrédients existants corrects. - S", (done) => {
        IngredientService.findManyIngredientsById(tab_id_ingredients,null ,function (err, value) {
            expect(value).lengthOf(3)
            done()

        })
    })
})

describe("findOneIngredient", () => {
    it("Chercher un ingrédient par les champs selectionnés. - S", (done) => {
        IngredientService.findOneIngredient(["name", "description"], ingredients[0].name,null, function (err, value) {
            expect(value).to.haveOwnProperty('name')
            done()

        })
    })
    it("Chercher un ingrédient sans tableau de champ. - E", (done) => {
        IngredientService.findOneIngredient("name", ingredients[0].name,null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
    it("Chercher un ingrédient inexistant. - E", (done) => {
        IngredientService.findOneIngredient(["name"], "ingredients[0].name",null ,function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})

describe("findManyIngredients", () => {
    it("Retourne 3 ingredients - S", (done) => {
        IngredientService.findManyIngredients(null, 3, 1, null, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(4)
            expect(value["results"]).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it("Faire une recherche avec 0 résultats correspondant - S", (done) => {
        IngredientService.findManyIngredients('couteau', 1, 3, null, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(1)
            expect(value["results"]).lengthOf(0)
            expect(err).to.be.null
            done()
        })
    })
    it("Envoi d'une chaine de caractère a la place de la page - E", (done) => {
        IngredientService.findManyIngredients(null, "coucou", 3, null, function (err, value) {
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("updateOneIngredient", () => {
    it("Modifier un ingrédient correct. - S", (done) => {
        IngredientService.updateOneIngredient(id_ingredient_valid, { name: "Moto", description: "Vroum vroum" },null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.haveOwnProperty('description')
            expect(value).to.haveOwnProperty('updated_at')
            expect(value['name']).to.be.equal('Moto')
            expect(value['description']).to.be.equal('Vroum vroum')
            done()

        })
    })
    it("Modifier un ingrédient avec id incorrect. - E", (done) => {
        IngredientService.updateOneIngredient("1200", { name: "Jean", price: 60 },null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un ingrédient avec des champs requis vide. - E", (done) => {
        IngredientService.updateOneIngredient(id_Ingredient_valid, { name: "", description: "pas bon" },null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("updateManyIngredients", () => {
    it("Modifier plusieurs ingrédients correctement. - S", (done) => {
        IngredientService.updateManyIngredients(tab_id_Ingredients, { name: "Jean", price: 80 },null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_Ingredients.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_Ingredients.length)
            done()

        })
    })
    it("Modifier plusieurs ingrédients avec id incorrect. - E", (done) => {
        IngredientService.updateManyIngredients("1200", { name: "trottinette", description: "oui oui" },null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs ingrédients avec des champs requis vide. - E", (done) => {
        IngredientService.updateManyIngredients(tab_id_Ingredients, { name: "", description: "test" },null, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("deleteOneIngredient", () => {
    it("Supprimer un ingrédient correct. - S", (done) => {
        IngredientService.deleteOneIngredient(id_Ingredient_valid,null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.haveOwnProperty('price')
            done()
        })
    })
    it("Supprimer un ingrédient avec un id incorrect. - E", (done) => {
        IngredientService.deleteOneIngredient("1200",null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un ingrédient avec un id inexistant. - E", (done) => {
        IngredientService.deleteOneIngredient("665f00c6f64f76ba59361e9f",null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyIngredients", () => {
    it("Supprimer plusieurs ingrédients correctement. - S", (done) => {
        IngredientService.deleteManyIngredients(tab_id_Ingredients,null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_Ingredients.length)
            done()

        })
    })
    it("Supprimer plusieurs ingrédients avec id incorrect. - E", (done) => {
        IngredientService.deleteManyIngredients("1200",null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
});

it("Suppression des utilisateurs fictif", (done) => {
    UserService.deleteManyUsers(tab_id_users,null, function (err, value) {
        done()
    })
})