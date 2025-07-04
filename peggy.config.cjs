module.exports = {
    input: "src/grammar/passage.pegjs",
    output: "src/grammar/passage.js",
    dts: true,
    returnTypes: {
        foo: "string",
    },
}