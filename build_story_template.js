const jsdom = require("jsdom");
const fs = require('fs');

const { JSDOM } = jsdom;

var script;
try {
    script = fs.readFileSync("./build/main.js", "utf8").trim();
} catch (err) {
    console.log(err);
    return;
}

var page = new JSDOM(`
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="utf-8">
        <title>{{STORY_NAME}}</title>
    </head>
    <body>
        {{STORY_DATA}}
		<tw-story>
			<tw-passage class="passage"></tw-passage>
		</tw-story>
        <script>
${script}
       </script>
    </body>
</html>`);

fs.writeFileSync("./build/story_template.html", page.serialize());
