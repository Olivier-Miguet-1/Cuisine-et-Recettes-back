const RecipeService = require('../../services/RecipeService')
const UserService = require('../../services/UserService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_recipe_valid = ""
var tab_id_recipes = []
var tab_id_users = []
var recipes = []

var tab_id_users =[]
let users = [
    {
        firstName: "Détenteur de recette 1",
        lastName: "Iencli",
        username: "oui1",
        email:"iencli1@gmail.com",
            password: "12345"
    },
    {
        firstName: "Détenteur de recette 2",
        lastName: "Iencli",
        username: "oui2",
        email:"iencli2@gmail.com",
            password: "12345"
    },
    {
        firstName: "Détenteur de recette 3",
        lastName: "Iencli",
        username: "oui3",
        email:"iencli3@gmail.com",
            password: "12345"
    },
    {
        firstName: "Détenteur de recette 4",
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

describe("addOneRecipe", (done) => {
    it("Recette correcte. - S", () => {
        var recipe = {
            name: "test",
            description: "ceci est une description",
            price: 10,
            quantity: 120,
            user_id: rdm_user(tab_id_users)
        }    
        RecipeService.addOneRecipe(recipe,null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            id_recipe_valid = value._id
            recipes.push(value)
            done()
        })
    })
    it("Recette incorrecte. (Sans name) - E", (done) => {
        var recipe_no_valid = {
            description: "ceci est une description",
            price: 11,
            quantity: 80,
            user_id: rdm_user(tab_id_users)
        }
        RecipeService.addOneRecipe(recipe_no_valid,null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("addManyRecipes", () => {
    it("Recettes à ajouter, valide. - S", (done) => {
        var recipes_tab = [{
            name: "fourchette",
            description: "ceci est une description",
            price: 20,
            quantity: 20,
            user_id: rdm_user(tab_id_users)
        }, {
            name: "assiette",
            description: "ceci est une description",
            price: 10,
            quantity: 50,
            user_id: rdm_user(tab_id_users)
        },
        {
            name: "couteau",
            description: "ceci est une description",
            price: 25,
            quantity: 8,
            user_id: rdm_user(tab_id_users)
        }]

        RecipeService.addManyRecipes(recipes_tab,null, function (err, value) {
            tab_id_recipes = _.map(value, '_id')
            recipes = [...value, ...recipes]
            expect(value).lengthOf(3)
            //console.log(value)
            done()
        })
    })
    it("Recettes à ajouter, non valide. - E", (done) => {
        var recipes_tab_error = [{
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

        RecipeService.addManyRecipes(recipes_tab_error,null, function (err, value) {
            done()
        })
    })
})

describe("findOneRecipeById", () => {
    it("Chercher une recette existante correcte. - S", (done) => {
        RecipeService.findOneRecipeById(id_article_valid,null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Chercher une recette non-existante correcte. - E", (done) => {
        RecipeService.findOneRecipeById("100",null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyRecipesById", () => {
    it("Chercher des recettes existantes correctes. - S", (done) => {
        RecipeService.findManyRecipesById(tab_id_articles,null ,function (err, value) {
            expect(value).lengthOf(3)
            done()

        })
    })
})

describe("findOneRecipe", () => {
    it("Chercher une recette par les champs selectionnés. - S", (done) => {
        RecipeService.findOneRecipe(["name", "description"], articles[0].name,null, function (err, value) {
            expect(value).to.haveOwnProperty('name')
            done()

        })
    })
    it("Chercher une recette sans tableau de champ. - E", (done) => {
        RecipeService.findOneRecipe("name", articles[0].name,null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
    it("Chercher une recette inexistante. - E", (done) => {
        RecipeService.findOneRecipe(["name"], "articles[0].name",null ,function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})

describe("findManyRecipes", () => {
    it("Retourne 3 articles - S", (done) => {
        RecipeService.findManyRecipes(null, 3, 1, null, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(4)
            expect(value["results"]).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it("Faire une recherche avec 0 résultats correspondant - S", (done) => {
        RecipeService.findManyRecipes('couteau', 1, 3, null, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(1)
            expect(value["results"]).lengthOf(0)
            expect(err).to.be.null
            done()
        })
    })
    it("Envoie d'une chaine de caractère a la place de la page - E", (done) => {
        RecipeService.findManyRecipes(null, "coucou", 3, null, function (err, value) {
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("updateOneRecipe", () => {
    it("Modifier une recette correcte. - S", (done) => {
        RecipeService.updateOneRecipe(id_article_valid, { name: "Moto", description: "Vroum vroum" },null, function (err, value) {
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
    it("Modifier une recette avec id incorrect. - E", (done) => {
        RecipeService.updateOneRecipe("1200", { name: "Jean", price: 60 },null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier une recette avec des champs requis vide. - E", (done) => {
        RecipeService.updateOneRecipe(id_recipe_valid, { name: "", description: "pas bon" },null, function (err, value) {
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

describe("updateManyRecipes", () => {
    it("Modifier plusieurs recettes correctement. - S", (done) => {
        RecipeService.updateManyRecipes(tab_id_recipes, { name: "Jean", price: 80 },null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_recipes.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_recipes.length)
            done()

        })
    })
    it("Modifier plusieurs recettes avec id incorrect. - E", (done) => {
        RecipeService.updateManyRecipes("1200", { name: "trottinette", description: "oui oui" },null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs recettes avec des champs requis vide. - E", (done) => {
        RecipeService.updateManyRecipes(tab_id_recipes, { name: "", description: "test" },null, function (err, value) {
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

describe("deleteOneRecipe", () => {
    it("Supprimer une recette correcte. - S", (done) => {
        RecipeService.deleteOneRecipe(id_recipe_valid,null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.haveOwnProperty('price')
            done()
        })
    })
    it("Supprimer une recette avec id incorrect. - E", (done) => {
        RecipeService.deleteOneRecipe("1200",null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer une recette avec un id inexistant. - E", (done) => {
        RecipeService.deleteOneRecipe("665f00c6f64f76ba59361e9f",null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyRecipes", () => {
    it("Supprimer plusieurs recettes correctement. - S", (done) => {
        RecipeService.deleteManyRecipes(tab_id_recipes,null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_recipes.length)
            done()

        })
    })
    it("Supprimer plusieurs recettes avec id incorrect. - E", (done) => {
        RecipeService.deleteManyRecipes("1200",null, function (err, value) {
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