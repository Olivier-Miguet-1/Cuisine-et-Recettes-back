const UtensilService = require('../../services/UtensilService')
const UserService = require('../../services/UserService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_utensil_valid = ""
var tab_id_utensils = []
var tab_id_users = []
var utensils = []

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

describe("addOneUtensil", (done) => {
    it("Ustensile correct. - S", () => {
        var utensil = {
            name: "test",
            description: "ceci est une description",
            price: 10,
            quantity: 120,
            user_id: rdm_user(tab_id_users)
        }    
        UtensilService.addOneUtensil(utensil,null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            id_utensil_valid = value._id
            utensils.push(value)
            done()
        })
    })
    it("Ustensile incorrect. (Sans name) - E", (done) => {
        var utensil_no_valid = {
            description: "ceci est une description",
            price: 11,
            quantity: 80,
            user_id: rdm_user(tab_id_users)
        }
        UtensilService.addOneUtensil(utensil_no_valid,null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("addManyUtensils", () => {
    it("Ustensiles à ajouter, valide. - S", (done) => {
        var utensils_tab = [{
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

        UtensilService.addManyUtensils(utensils_tab,null, function (err, value) {
            tab_id_utensils = _.map(value, '_id')
            utensils = [...value, ...utensils]
            expect(value).lengthOf(3)
            //console.log(value)
            done()
        })
    })
    it("Ustensiles à ajouter, non valide. - E", (done) => {
        var utensils_tab_error = [{
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

        UtensilService.addManyUtensils(utensils_tab_error,null, function (err, value) {
            done()
        })
    })
})

describe("findOneUtensilById", () => {
    it("Chercher un ustensile existant correct. - S", (done) => {
        UtensilService.findOneUtensilById(id_utensil_valid,null, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Chercher un ustensile non-existant correct. - E", (done) => {
        UtensilService.findOneUtensilById("100",null, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyUtensilsById", () => {
    it("Chercher des ustensiles existants corrects. - S", (done) => {
        UtensilService.findManyUtensilsById(tab_id_utensils,null ,function (err, value) {
            expect(value).lengthOf(3)
            done()

        })
    })
})

describe("findOneUtensil", () => {
    it("Chercher un ustensile par les champs selectionnés. - S", (done) => {
        UtensilService.findOneUtensil(["name", "description"], utensils[0].name,null, function (err, value) {
            expect(value).to.haveOwnProperty('name')
            done()

        })
    })
    it("Chercher un ustensile sans tableau de champ. - E", (done) => {
        UtensilService.findOneUtensil("name", utensils[0].name,null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
    it("Chercher un ustensile inexistant. - E", (done) => {
        UtensilService.findOneUtensil(["name"], "utensils[0].name",null ,function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})

describe("findManyUtensils", () => {
    it("Retourne 3 ustensiles - S", (done) => {
        UtensilService.findManyUtensils(null, 3, 1, null, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(4)
            expect(value["results"]).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it("Faire une recherche avec 0 résultats correspondant - S", (done) => {
        UtensilService.findManyUtensils('couteau', 1, 3, null, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(1)
            expect(value["results"]).lengthOf(0)
            expect(err).to.be.null
            done()
        })
    })
    it("Envoi d'une chaine de caractère a la place de la page - E", (done) => {
        UtensilService.findManyUtensils(null, "coucou", 3, null, function (err, value) {
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("updateOneUtensil", () => {
    it("Modifier un ustensile correct. - S", (done) => {
        UtensilService.updateOneUtensil(id_utensil_valid, { name: "Moto", description: "Vroum vroum" },null, function (err, value) {
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
    it("Modifier un ustensile avec id incorrect. - E", (done) => {
        UtensilService.updateOneUtensil("1200", { name: "Jean", price: 60 },null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un ustensile avec des champs requis vide. - E", (done) => {
        UtensilService.updateOneUtensil(id_utensil_valid, { name: "", description: "pas bon" },null, function (err, value) {
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

describe("updateManyUtensils", () => {
    it("Modifier plusieurs ustensiles correctement. - S", (done) => {
        UtensilService.updateManyUtensils(tab_id_utensils, { name: "Jean", price: 80 },null, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_utensils.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_utensils.length)
            done()

        })
    })
    it("Modifier plusieurs ustensiles avec id incorrect. - E", (done) => {
        UtensilService.updateManyUtensils("1200", { name: "trottinette", description: "oui oui" },null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs ustensiles avec des champs requis vide. - E", (done) => {
        UtensilService.updateManyUtensils(tab_id_utensils, { name: "", description: "test" },null, function (err, value) {
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

describe("deleteOneUtensil", () => {
    it("Supprimer un ustensile correct. - S", (done) => {
        UtensilService.deleteOneUtensil(id_utensil_valid,null, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.haveOwnProperty('price')
            done()
        })
    })
    it("Supprimer un ustensile avec id incorrect. - E", (done) => {
        UtensilService.deleteOneUtensil("1200",null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un ustensile avec un id inexistant. - E", (done) => {
        UtensilService.deleteOneUtensil("665f00c6f64f76ba59361e9f",null, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyUtensils", () => {
    it("Supprimer plusieurs ustensiles correctement. - S", (done) => {
        UtensilService.deleteManyUtensils(tab_id_utensils,null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_utensils.length)
            done()

        })
    })
    it("Supprimer plusieurs ustensiles avec id incorrect. - E", (done) => {
        UtensilService.deleteManyUtensils("1200",null, function (err, value) {
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