const { hideBin } = require("yargs/helpers");
describe("Command line", function () {
    test("if command line argv equal 0", function (done) {
        const argv = hideBin(process.argv);
        argv.pop();
        argv.push("coins");
        expect(argv[0]).toEqual("coins");
        done();
    });
});
