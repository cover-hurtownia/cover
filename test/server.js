import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../server.js';
import bcrypt from "bcryptjs";

chai.use(chaiHttp);
const expect = chai.expect;

describe("server", function() {
    let server;
    before(async function() {
        server = app.listen();
    });

    describe("GET /", function() {
        let response;

        before(async function() {
            response = await chai.request(app)
                .get("/");
        });

        it("should respond with status 200", async function() {
            expect(response).to.have.status(200);
        });

        it("should respond with Content-Type: text/html", async function() {
            expect(response.type).to.equal("text/html");
        });
    });

    describe("POST /api/echo", function() {
        const data = { "foo": 42, "bar": 69 };
        let response;

        before(async function() {
            response = await chai.request(app)
                .post("/api/echo")
                .set("Content-Type", "application/json")
                .send(data);
        });

        it("should respond with status 200", async function() {
            expect(response).to.have.status(200);
        });

        it("should respond with Content-Type: application/json", async function() {
            expect(response.type).to.equal("application/json");
        });

        it("should respond with a message", async function() {
            expect(response.body.message).to.be.ok;
            expect(response.body.message).to.be.a("string");
        });

        it("should respond with the same data", async function() {
            expect(response.body.data).to.deep.equal(data);
        });
    });

    describe("POST /api/register", function() {
        const db = app.get("database");

        before(async function() {
            await db.migrate.latest();
        });

        describe("invalid request", function() {
            const data = { "username": "", "password": "" };
            let response;
    
            before(async function() {
                response = await chai.request(app)
                    .post("/api/register")
                    .set("Content-Type", "application/json")
                    .send(data);
            });

            it("should respond with Content-Type: application/json", async function() {
                expect(response.type).to.equal("application/json");
            });

            it("should respond with error status", async function() {
                expect(response.body.status).to.equal("error");
            });
            
            it("should respond with error message", async function() {
                expect(response.body.error).to.be.a("string");
            });
        });

        describe("valid request", function() {
            const data = { "username": "AzureDiamond", "password": "hunter2" };
            let response;
    
            before(async function() {
                response = await chai.request(app)
                    .post("/api/register")
                    .set("Content-Type", "application/json")
                    .send(data);
            });

            it("should respond with session cookie", async function() {
                expect(response).to.have.cookie("session");
            });

            it("should respond with session_username cookie", async function() {
                expect(response).to.have.cookie("session");
            });

            it("should respond with Content-Type: application/json", async function() {
                expect(response.type).to.equal("application/json");
            });

            it("should respond with ok status", async function() {
                expect(response.body.status).to.equal("ok");
            });

            it("should create a user entry in database", async function() {
                const usersInDatabase = await db('users').where({ username: data.username });

                expect(usersInDatabase).to.have.lengthOf(1);
                
                const user = usersInDatabase[0];

                expect(user.username).to.equal(data.username);
                
                const passwordMatches = await bcrypt.compare(data.password, user.password_hash);

                expect(passwordMatches).to.be.true;
            });
        });

        describe("username already exists", function() {
            const data = { "username": "AzureDiamond", "password": "hunter2" };
            let response;
    
            before(async function() {
                response = await chai.request(app)
                    .post("/api/register")
                    .set("Content-Type", "application/json")
                    .send(data);
            });

            it("should respond with Content-Type: application/json", async function() {
                expect(response.type).to.equal("application/json");
            });

            it("should respond with error status", async function() {
                expect(response.body.status).to.equal("error");
            });

            it("should respond with error message", async function() {
                expect(response.body.error).to.be.a("string");
            });
        });

        after(async function() {
            await db.migrate.rollback();
        });
    });

    describe("POST /api/login", function() {
        const db = app.get("database");

        before(async function() {
            await db.migrate.latest();

            const data = { "username": "AzureDiamond", "password": "hunter2" };

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(data.password, salt);

            await db('users').insert({ username: data.username, password_hash: passwordHash });
        });

        describe("valid request", function() {
            const data = { "username": "AzureDiamond", "password": "hunter2" };
            let response;
    
            before(async function() {
                response = await chai.request(app)
                    .post("/api/login")
                    .set("Content-Type", "application/json")
                    .send(data);
            });

            it("should respond with session cookie", async function() {
                expect(response).to.have.cookie("session");
            });

            it("should respond with session_username cookie", async function() {
                expect(response).to.have.cookie("session");
            });

            it("should respond with Content-Type: application/json", async function() {
                expect(response.type).to.equal("application/json");
            });

            it("should respond with ok status", async function() {
                expect(response.body.status).to.equal("ok");
            });
        });

        after(async function() {
            await db.migrate.rollback();
        });
    });

    after(async function() {
        server.close();
    });
});