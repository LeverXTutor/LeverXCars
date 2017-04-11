/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/
"use strict";

module.exports  = function(app,server) {
	app.use("/node", require("./routes/myNode")());
	app.use("/node/excAsync", require("./routes/exerciseAsync")(server));
};