module.exports = {
    input: "src/grammar/passage.pegjs",
    output: "src/grammar/passage_test.js",
		allowedStartRules: ["*"],
    dts: true,
    returnTypes: {
        foo: "string",
    },
}