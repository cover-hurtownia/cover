import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../server.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe("server", function() {
    let server;
    before(async function() {
        server = app.listen("127.0.0.1", 18080);
    });

    describe("GET /", function() {
        let response;

        before(async function() {
            response = await chai.request(app)
                .get("/");
        });

        it("should respond with status 200", async function() {
            expect(response.status).to.equal(200);
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
            expect(response.status).to.equal(200);
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

    after(async function() {
        server.close();
    });
});