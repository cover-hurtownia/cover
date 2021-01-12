import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../server.js';
import bcrypt from "bcryptjs";
import * as errorCodes from "../www/js/common/errorCodes.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("server", function() {
    
});