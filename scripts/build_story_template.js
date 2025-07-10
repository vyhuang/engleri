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

let ink_block;
try {
    let ink_block_contents = readFileSync("./src/story/templates/ink_block.template", "utf8").trim();
    ink_block = `<tw-storydefaults tags="ink_block" name="basic_ink_block">${ink_block_contents}</tw-storydefaults>`;
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
            <div id="story_defaults" hidden="hidden">
${ink_block}
            </div>
			<tw-passage class="passage"></tw-passage>
		</tw-story>
        <script>
${script}
       </script>
    </body>
</html>`);

writeFileSync("./build/story_template.html", page.serialize());
