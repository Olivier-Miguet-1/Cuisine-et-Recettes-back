const UserService = require("../../services/UserService");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("./../../server");
let should = chai.should();
const _ = require("lodash");
var tab_id_users = [];
var recipes = [];
let token_login = "";

let users = [
  {
    firstName: "Détenteur de recette 1",
    lastName: "Iencli",
    username: "oui1",
    email: "iencli1@gmail.com",
    password: "12345",
  },
  {
    firstName: "Détenteur de recette 2",
    lastName: "Iencli",
    username: "oui2",
    email: "iencli2@gmail.com",
    password: "12345",
  },
  {
    firstName: "Détenteur de recette 3",
    lastName: "Iencli",
    username: "oui3",
    email: "iencli3@gmail.com",
    password: "12345",
  },
  {
    firstName: "Détenteur de recette 4",
    lastName: "Iencli",
    username: "oui4",
    email: "iencli4@gmail.com",
    password: "12345",
  },
];

describe("Gestion des tests ajout, d'utilisateurs.", () => {
  it("Création des utilisateurs fictif", (done) => {
    UserService.addManyUsers([...users], null, function (err, value) {
      tab_id_users = _.map(value, "_id");
      done();
    });
  });
});
describe("POST - /login", () => {
  it("Authentifier l'utilisateur crée. - S", (done) => {
    chai
      .request(server)
      .post("/login")
      .send({
        username: users[0].username,
        password: "12345",
      })
      .end((err, res) => {
        //   console.log(res.body,  users[0].username, users[0].password)
        expect(res).to.have.status(200);
        token_login = res.body.token;
        done();
      });
  });
});

function rdm_user(tab) {
  let rdm_id = tab[Math.floor(Math.random() * tab.length)];
  return rdm_id;
}

chai.use(chaiHttp);

describe("POST - /recipe", () => {
  it("Ajouter une recette. - S", (done) => {
    chai
      .request(server)
      .post("/recipe")
      .send({
        name: "crêpes",
        description: "ceci est une description",
        price: 2,
        quantity: 40,
        user_id: rdm_user(tab_id_users),
      })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        recipes.push(res.body);
        done();
      });
  });
  it("Ajouter une recette incorrecte. (Sans name) - E", (done) => {
    chai
      .request(server)
      .post("/recipe")
      .send({
        description: "ceci est une description",
        price: 2,
        quantity: 40,
        user_id: rdm_user(tab_id_users),
      })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        expect(res).to.have.status(405);
        done();
      });
  });
  it("Ajouter une recette incorrecte. (Avec une quantité < 0 ) - E", (done) => {
    chai
      .request(server)
      .post("/recipe")
      .send({
        name: "Kouign",
        description: "ceci est une description",
        price: 3,
        quantity: -3,
      })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        expect(res).to.have.status(405);
        done();
      });
  });
  it("Ajouter une recette incorrecte. (Avec un champ vide) - E", (done) => {
    chai
      .request(server)
      .post("/recipe")
      .send({
        name: "",
        description: "ceci est une description",
        price: 5,
        quantity: 7,
        user_id: rdm_user(tab_id_users),
      })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        expect(res).to.have.status(405);
        done();
      });
  });
});

describe("GET - /recipe/:id", () => {
  it("Chercher une recette correcte. - S", (done) => {
    chai
      .request(server)
      .get("/recipe/" + recipes[0]._id)
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Chercher une recette incorrecte (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .get("/recipe/665f18739d3e172be5daf092")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Chercher une recette incorrecte (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .get("/recipe/123")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("GET - /recipes", () => {
  it("Chercher plusieurs recettes. - S", (done) => {
    chai
      .request(server)
      .get("/recipes")
      .query({ id: _.map(recipes, "_id") })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("Chercher plusieurs recettes incorrectes (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .get("/recipes")
      .query({ id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"] })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Chercher plusieurs recettes incorrectes (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .get("/recipes")
      .query({ id: ["123", "456"] })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("PUT - /recipe", () => {
  it("Modifier une recette. - S", (done) => {
    chai
      .request(server)
      .put("/recipe/" + recipes[0]._id)
      .send({ name: "Tv" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Modifier une recette avec un id invalide. - E", (done) => {
    chai
      .request(server)
      .put("/recipe/123456789")
      .send({ name: "pommier", description: "Un arbre" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Modifier une recette avec un id inexistant. - E", (done) => {
    chai
      .request(server)
      .put("/recipe/66791a552b38d88d8c6e9ee7")
      .send({ name: "pommier", description: "Un arbre" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Modifier une recette avec un champ requis vide. - E", (done) => {
    chai
      .request(server)
      .put("/recipe/" + recipes[0]._id)
      .send({ name: "", description: "Un arbre" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("PUT - /recipes", () => {
  it("Modifier plusieurs recipes. - S", (done) => {
    chai
      .request(server)
      .put("/recipes")
      .query({ id: _.map(recipes, "_id") })
      .send({ price: 30 })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Modifier plusieurs recipes avec des ids invalide. - E", (done) => {
    chai
      .request(server)
      .put("/recipes")
      .query({ id: ["267428142", "41452828"] })
      .send({ name: "Alexandre" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Modifier plusieurs recipes avec des ids inexistant. - E", (done) => {
    chai
      .request(server)
      .put("/recipes")
      .query({ id: ["66791a552b38d88d8c6e9ee7", "667980886db560087464d3a7"] })
      .send({ name: "Lutfu" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Modifier des recipes avec un champ requis vide. - E", (done) => {
    chai
      .request(server)
      .put("/recipes")
      .query({ id: _.map(recipes, "_id") })
      .send({ name: "" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("DELETE - /recipe", () => {
  it("Supprimer une recipe. - S", (done) => {
    chai
      .request(server)
      .delete("/recipe/" + recipes[0]._id)
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Supprimer une recipe incorrect (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .delete("/recipe/665f18739d3e172be5daf092")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Supprimer une recipe incorrect (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .delete("/recipe/123")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("DELETE - /recipes", () => {
  it("Supprimer plusieurs recipes. - S", (done) => {
    chai
      .request(server)
      .delete("/recipes")
      .query({ id: _.map(recipes, "_id") })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Supprimer plusieurs recipes incorrects (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .delete("/recipes/665f18739d3e172be5daf092&665f18739d3e172be5daf093")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Supprimer plusieurs recipes incorrects (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .delete("/recipes")
      .query({ id: ["123", "456"] })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});
describe("Gestion des tests ajout, d'utilisateurs.", () => {
  it("Suppression des utilisateurs fictif", (done) => {
    UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
      done();
    });
  });
});
