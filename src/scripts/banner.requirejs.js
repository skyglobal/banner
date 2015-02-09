var local = {}; local['banner'] = require('./banner');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-banner/dist/scripts/banner.requirejs', [], function() {
        'use strict';
        return local['banner'];
    });
}