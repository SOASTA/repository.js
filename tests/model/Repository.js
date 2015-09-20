/*global describe,it*/
var path = require("path"),
    chai = require("chai"),
    nock = require("nock"),
    q = require("q");

var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "model", "Repository.js");
var REQUIRE_CONSTANTS = path.join(__dirname, "..", "..", "lib", "constants.js");

var assert = chai.assert;

describe("Repository Tests", function(){
    it("Should require without problems", function(){
        require(REQUIRE_CLASS);
    });

    it("Should create an instance of SOASTA.Repository", function(){
        var Repository = require(REQUIRE_CLASS).Repository;

        var repository = new Repository("");

        assert.instanceOf(repository, Repository);
    });

    it("Should recieve a mocked AuthToken on connect", function(done){
        var token_expected = { token: "1" },
            tenantname = "soasta",
            username = "soasta",
            password = "password";

        var repositoryAPI = nock("http://mpulse.soasta.com")
                .put("/concerto/services/rest/RepositoryService/v1/Tokens")
                .reply(200,  function(uri, requestBody) {
                    var requestBodyObject = JSON.parse(requestBody);

                    assert.strictEqual(requestBodyObject.userName, username);
                    assert.strictEqual(requestBodyObject.password, password);
                    return token_expected;
                });

        var constants = require(REQUIRE_CONSTANTS);
        var Repository = require(REQUIRE_CLASS).Repository;

        var repository = new Repository(constants.REPOSITORY_URL);

        repository.connect(tenantname, username, password, function(error) {
            assert.strictEqual(repository.token, token_expected.token);
            assert.isNull(error);
            done();
        });
    });

    it("Should return an error in the callback on connect", function(done){
        var token_expected = { token: "1" },
            tenantname = "doesnotexist",
            username = "doesnotexist",
            password = "doesnotexist",
            expect = { code: 401, message: 'Unauthorized' };

        var repositoryAPI = nock("http://mpulse.soasta.com")
                .put("/concerto/services/rest/RepositoryService/v1/Tokens")
                .replyWithError(expect);

        var constants = require(REQUIRE_CONSTANTS);
        var Repository = require(REQUIRE_CLASS).Repository;

        var repository = new Repository(constants.REPOSITORY_URL);

        repository.connect(tenantname, username, password, function(error, result) {
            assert.deepEqual(error, expect);
            assert.isUndefined(result);
            done();
        });
    });

    it("Should create a promise based version of Repository API", function(done){

        var token_expected = { token: "1" },
            tenantname = "soasta",
            username = "soasta",
            password = "password";

        var repositoryAPI = nock("http://mpulse.soasta.com")
                .put("/concerto/services/rest/RepositoryService/v1/Tokens")
                .reply(200,  function(uri, requestBody) {
                    var requestBodyObject = JSON.parse(requestBody);

                    assert.strictEqual(requestBodyObject.userName, username);
                    assert.strictEqual(requestBodyObject.password, password);
                    return token_expected;
                });

        var constants = require(REQUIRE_CONSTANTS);
        var Repository = require(REQUIRE_CLASS).Repository;

        var repository = new Repository(constants.REPOSITORY_URL);
        repository = repository.asPromises(q);

        repository.connect(tenantname, username, password).then(function(error) {

            done();
        });
    });
});