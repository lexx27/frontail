var connect = require('connect');
var fs = require('fs');

(function () {
    'use strict';

    var ConnectBuilder = function () {
        this.app = connect();
    };

    ConnectBuilder.prototype.authorize = function (user, pass) {
        this.app.use(connect.basicAuth(function (incomingUser, incomingPass) {
            return user === incomingUser && pass === incomingPass;
        }));

        return this;
    };

    ConnectBuilder.prototype.build = function () {
        return this.app;
    };

    ConnectBuilder.prototype.index = function (path, title, theme) {
        theme = theme || 'default';

        this.app.use(function (req, res) {
            fs.readFile(path, function (err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data.toString('utf-8')
                    .replace(/__TITLE__/g, title)
                    .replace(/__THEME__/g, theme),
                    'utf-8'
                );
            });
        });

        return this;
    };

    ConnectBuilder.prototype.session = function (secret, key) {
        this.app.use(connect.cookieParser());
        this.app.use(connect.session({secret: secret, key: key}));
        return this;
    };

    ConnectBuilder.prototype.static = function (path) {
        this.app.use(connect.static(path));
        return this;
    };

    module.exports = function () {
        return new ConnectBuilder();
    };
})();