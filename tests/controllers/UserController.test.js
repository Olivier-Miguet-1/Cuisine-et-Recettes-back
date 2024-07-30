const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
let should = chai.should();
const _ = require('lodash')
var user = null
var users = []
var token_login = ""

chai.use(chaiHttp)


describe("POST - /user", () => {
    it("Ajouter un utilisateur. - S", (done) => {
        chai.request(server).post('/user').send({
            firstName: "luf",
            lastName: "Us",
            username: "dwarfSlayer",
            email: "lutfu.us@gmail.com",
            password:"123456"
        }).end((err, res) => {
            expect(res).to.have.status(201)
            users.push(res.body)
            done()
        });
    })
    it("Ajouter un utilisateur pour login. - S", (done) => {
        chai.request(server).post('/user').send({
            firstName: "luf",
            lastName: "Us",
            username: "dwarfSlayer1",
            email: "lutfu.us1@gmail.com",
            password:"123456"
        }).end((err, res) => {
            expect(res).to.have.status(201)
            user = res.body
            done()
        });
    })
    it("Ajouter un utilisateur incorrect. (Sans firstName) - E", (done) => {
        chai.request(server).post('/user').send({
            lastName: 'Us',
            username: 'dwarfSlayr',
            email: 'lutfu.us@gmil.com',
            password:"123456"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un username existant) - E", (done) => {
        chai.request(server).post('/user').send({
            firstName: "luf",
            lastName: "Us",
            username: "dwarfSlayer",
            email: "lutfu.us@gmai.com",
            password:"123456"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/user').send({
            firstName: "luffu",
            lastName: "",
            username: "dwarfSlaye",
            email: "lufu.us@gmai.com",
            password:"123456"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})

describe("POST - /login", () => {
    it("Authentifier l'utilisateur crée. - S", (done) => {
        chai.request(server).post('/login').send({
            username: "dwarfSlayer1",
            password:"123456"
        }).end((err, res) => {
            expect(res).to.have.status(200)
            token_login = res.body.token
            done()
        })
    })
})

describe("POST - /users", () => {
    it("Ajouter des utilisateurs correct. - S", (done) => {
        chai.request(server).post('/users').auth(token_login, { type: 'bearer' }).send([
            {
                firstName: "Aurelien",
                lastName: "Mosini",
                username: "waterBiker",
                email: "aurel.mosini@gmail.com",
            password:"123456"
            },
            {
                firstName: "Alexandre",
                lastName: "Porteron",
                username: "AlexLeGrand",
                email: "alexandre.porteron@gmail.com",
            password:"123456"
            }
        ]).end((err, res) => {
            users = [...users, ...res.body]
            // 
            expect(res).to.have.status(201)
            done()
        });
    })
    it("Ajouter des utilisateurs incorrect. (Sans firstName) - E", (done) => {
        chai.request(server).post('/users').auth(token_login, { type: 'bearer' }).send([
            {
                lastName: "Mosini",
                username: "waterBike",
                email: "aurel.mosin@gmail.com"
            },
            {
              
                lastName: "Porteron",
                username: "AlexLeGran",
                email: "alexandre.portern@gmail.com"
            }
        ]).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        });
    })
    it("Ajouter des utilisateurs incorrect. (Avec un username existant) - E", (done) => {
        chai.request(server).post('/users').auth(token_login, { type: 'bearer' }).send([
            {
                firstName: "Aurelien",
                lastName: "Mosini",
                username: "waterBiker",
                email: "aurel.moini@gmail.com"
            },
            {
                firstName: "Alexandre",
                lastName: "Porteron",
                username: "AlexLeGrand",
                email: "alexndre.porteron@gmail.com"
            }
        ]).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        });
    })
    it("Ajouter des utilisateurs incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/users').auth(token_login, { type: 'bearer' }).send([
            {
                firstName: "Aurelien",
                lastName: "",
                username: "waterBiker",
                email: "aurel.mosini@gmail.com"
            },
            {
                firstName: "Alexandre",
                lastName: "Porteron",
                username: "AlexLeGrand",
                email: "alexandre.porteron@gmail.com"
            }
        ]).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})

describe("GET - /user", () => {
    it("Chercher un utilisateur par un champ sélectionné. - S", (done) => {
        chai.request(server).get('/user').query({fields: ["username"], value: users[0].username}).auth(token_login, { type: 'bearer' })    
       .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })                                                     
    it("Chercher un utilisateur par un champ non autorisé. - E", (done) => {                                      
        chai.request(server).get('/user').query({fields: ["firstname"], value: users[0].username}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Chercher un utilisateur sans aucunes query. - E", (done) => {             //   ESSAI
        chai.request(server).get('/user').auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Chercher un utilisateur inexistant - E", (done) => {               //   ESSAI
        chai.request(server).get('/user').query({fields: ["username"], value: "Mathis lebg"}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
    })
})
})


describe("GET - /user/:id", () => {                                                         
    it("Chercher un utilisateur correct. - S", (done) => {                                       //   Avec l'ID
        chai.request(server).get('/user/' + users[0]._id).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Chercher un utilisateur incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/user/665f18739d3e172be5daf092').auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher un utilisateur incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).get('/user/123').auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    
})

describe("GET - /users_by_filters", () => {
    it("Trouver les utilisateurs de la page 3. - S", (done) => {                          
        chai.request(server).get('/users_by_filters') .auth(token_login, { type: 'bearer' }).query({page: 3, limit: 3})
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body.results).to.be.an('array')
            done()
        })
    })

    it("Trouver les utilisateurs avec page manquant. - S", (done) => {
        chai.request(server).get('/users_by_filters').auth(token_login, { type: 'bearer' }).query({limit:3}).end((err, res) => {
            res.should.have.status(200)
            expect(res.body.results).to.be.an("array")
            expect(res.body.count).to.be.equal(4)
            done()
        })
    })

    it("Chercher plusieurs utilisateurs avec une chaine de caracteres dans page. - E", (done) => {
        chai.request(server).get('/users_by_filters').auth(token_login, { type: 'bearer' }).query({page: 'une phrase', pageSize: 2})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("GET - /users", () => {
    it("Chercher plusieurs utilisateurs par ID. - S", (done) => {                               //   Avec l'ID
        chai.request(server).get('/users').query({id: _.map(users, '_id')}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
        res.should.have.status(200)
            done()
        })
    })

    it("Chercher plusieurs utilisateurs incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/users').auth(token_login, { type: 'bearer' }).query({id: ["6683c22cc3d78c96381f83ee", "66791a822b38d88d8c6e9eed"]})
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher plusieurs utilisateurs incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).get('/users').auth(token_login, { type: 'bearer' }).query({id: ['123', '456']})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /user", () => {
    it("Modifier un utilisateur. - S", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ firstName: "Olivier" }).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Modifier un utilisateur avec un id invalide. - E", (done) => {
        chai.request(server).put('/user/123456789').send({firstName: "Olivier", lastName: "Edouard"}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier un utilisateur avec un id inexistant. - E", (done) => {
        chai.request(server).put('/user/66791a552b38d88d8c6e9ee7').send({firstName: "Olivier", lastName: "Edouard"}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier un utilisateur avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ firstName: "", lastName: "Edouard" }).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier un utilisateur avec un champ unique existant. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ username: users[1].username}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

})
                                       //----------PUT--------------
describe("PUT - /users", () => {
    it("Modifier plusieurs utilisateurs. - S", (done) => {
        chai.request(server).put('/users').query({id: _.map(users, '_id')}).send({ firstName: "Lucas" }).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Modifier plusieurs utilisateurs avec des ids invalide. - E", (done) => {
        chai.request(server).put('/users').query({id: ["267428142", "41452828"]}).send({firstName: "Olivier"}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier plusieurs utilisateurs avec des ids inexistant. - E", (done) => {
        chai.request(server).put('/users').query({id: ["66791a552b38d88d8c6e9ee7", "667980886db560087464d3a7"]}).send({firstName: "Olivier"}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier des utilisateurs avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/users').query({ id: _.map(users, '_id')}).send({ firstName: ""}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier des utilisateurs avec un champ unique existant. - E", (done) => {
        chai.request(server).put('/users').query({id: _.map(users, '_id')}).send({ username: users[1].username}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            
            res.should.have.status(405)
            done()
        })
    })

})


describe("DELETE - /users", () => {
    it("Supprimer plusieurs utilisateurs. - S", (done) => {
        chai.request(server).delete('/users').query({id: _.map(users, '_id')}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer plusieurs utilisateurs incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/users/665f18739d3e172be5daf092&665f18739d3e172be5daf093').auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer plusieurs utilisateurs incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/users').query({id: ['123', '456']}).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})


describe("DELETE - /user", () => {

    it("Supprimer un utilisateur incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/user/665f18739d3e172be5daf092').auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer un utilisateur incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/user/123').auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    it("Supprimer un utilisateur. - S", (done) => {
        chai.request(server).delete('/user/' + user._id).auth(token_login, { type: 'bearer' })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
})
