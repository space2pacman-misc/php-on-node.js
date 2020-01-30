var http = require("http");
var fs = require("fs");
var tags = {
	"<?php": "<script>",
	"?>": "</script>",
	"echo": "document.write(%value%)"
}

http.createServer(onRequest).listen(7777);

function onRequest(request, response) {
	var file = fs.readFileSync("index.php", "utf-8");

	for(var tag in tags) {
		if(tag === "echo") {
			var body = file.match(/echo (.*?)\;/)[1];

			file = file.replace(/(?=echo).*/gi, `${tags[tag].replace("%value%", body)}`);
		} else {
			file = file.replace(tag, tags[tag])
		}
	}

	response.write(file);
	response.end();
}