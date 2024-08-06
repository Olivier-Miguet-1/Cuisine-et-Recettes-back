const UserService = require("../../services/UserService");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("./../../server");
let should = chai.should();
const _ = require("lodash");
var tab_id_users = [];
var utensils = [];
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

describe("POST - /utensil", () => {
  it("Ajouter un ustensile. - S", (done) => {
    chai
      .request(server)
      .post("/utensil")
      .send({
        name: "Fouet",
        description: "ceci est une description",
        price: 2,
        quantity: 40,
        user_id: rdm_user(tab_id_users),
      })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        utensils.push(res.body);
        done();
      });
  });
  it("Ajouter un ustensile incorrect. (Sans name) - E", (done) => {
    chai
      .request(server)
      .post("/utensil")
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
  it("Ajouter un ustensile incorrect. (Avec une quantité < 0 ) - E", (done) => {
    chai
      .request(server)
      .post("/utensil")
      .send({
        name: "Cuillère à soupe",
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
  it("Ajouter un ustensile incorrect. (Avec un champ vide) - E", (done) => {
    chai
      .request(server)
      .post("/utensil")
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

describe("GET - /utensil/:id", () => {
  it("Chercher un ustensile correct. - S", (done) => {
    chai
      .request(server)
      .get("/utensil/" + utensils[0]._id)
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Chercher un ustensile incorrect (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .get("/utensil/665f18739d3e172be5daf092")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Chercher un ustensile incorrect (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .get("/utensil/123")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("GET - /utensils", () => {
  it("Chercher plusieurs ustensiles. - S", (done) => {
    chai
      .request(server)
      .get("/utensils")
      .query({ id: _.map(utensils, "_id") })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("Chercher plusieurs ustensiles incorrects (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .get("/utensils")
      .query({ id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"] })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Chercher plusieurs ustensiles incorrects (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .get("/utensils")
      .query({ id: ["123", "456"] })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("PUT - /utensil", () => {
  it("Modifier un ustensile. - S", (done) => {
    chai
      .request(server)
      .put("/utensil/" + utensils[0]._id)
      .send({ name: "Tv" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Modifier un ustensile avec un id invalide. - E", (done) => {
    chai
      .request(server)
      .put("/utensil/123456789")
      .send({ name: "pommier", description: "Un arbre" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Modifier un ustensile avec un id inexistant. - E", (done) => {
    chai
      .request(server)
      .put("/utensil/66791a552b38d88d8c6e9ee7")
      .send({ name: "pommier", description: "Un arbre" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Modifier un ustensile avec un champ requis vide. - E", (done) => {
    chai
      .request(server)
      .put("/utensil/" + utensils[0]._id)
      .send({ name: "", description: "Un arbre" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("PUT - /utensils", () => {
  it("Modifier plusieurs ustensiles. - S", (done) => {
    chai
      .request(server)
      .put("/utensils")
      .query({ id: _.map(utensils, "_id") })
      .send({ price: 30 })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Modifier plusieurs ustensiles avec des ids invalide. - E", (done) => {
    chai
      .request(server)
      .put("/utensils")
      .query({ id: ["267428142", "41452828"] })
      .send({ name: "Alexandre" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Modifier plusieurs ustensiles avec des ids inexistant. - E", (done) => {
    chai
      .request(server)
      .put("/utensils")
      .query({ id: ["66791a552b38d88d8c6e9ee7", "667980886db560087464d3a7"] })
      .send({ name: "Lutfu" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Modifier des ustensiles avec un champ requis vide. - E", (done) => {
    chai
      .request(server)
      .put("/utensils")
      .query({ id: _.map(utensils, "_id") })
      .send({ name: "" })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("DELETE - /utensil", () => {
  it("Supprimer un ustensile. - S", (done) => {
    chai
      .request(server)
      .delete("/utensil/" + utensils[0]._id)
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Supprimer un ustensile incorrect (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .delete("/utensil/665f18739d3e172be5daf092")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Supprimer un ustensile incorrect (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .delete("/utensil/123")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("DELETE - /utensils", () => {
  it("Supprimer plusieurs ustensiles. - S", (done) => {
    chai
      .request(server)
      .delete("/utensils")
      .query({ id: _.map(utensils, "_id") })
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Supprimer plusieurs ustensiles incorrects (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .delete("/utensils/665f18739d3e172be5daf092&665f18739d3e172be5daf093")
      .auth(token_login, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Supprimer plusieurs ustensiles incorrects (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .delete("/utensils")
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
