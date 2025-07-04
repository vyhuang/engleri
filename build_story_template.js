import jsdom from "jsdom";
import { readFileSync, writeFileSync } from 'fs';

let script;
try {
    script = readFileSync("./build/main.js", "utf8").trim();
} catch (err) {
    throw new Error(err);
}

let styling;
try {
    styling = readFileSync("./build/main.css", "utf8").trim();
} catch (err) {
    throw new Error(err);
}


let page = new jsdom.JSDOM(`
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="utf-8">
        <title>{{STORY_NAME}}</title>
        <style>
${styling}
        </style>
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

writeFileSync("./build/story_template.html", page.serialize());
