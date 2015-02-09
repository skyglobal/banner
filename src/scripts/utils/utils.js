var utils = {
    extend: function(defaults, config) {

        if (!defaults) {
            defaults = {};
        }

        if (!config) {
            config = {};
        }

        for (var item in config) {
            defaults[item] = config[item];
        }

        return defaults;
    },

    getCookie: function(cookieName) {

        var cookies = {},
            tokens  = document.cookie.split('; '),
            split;

        for (var i = 0, len = tokens.length; i < len; i++) {
            split = tokens[i].split('=');
            cookies[split[0]] = split[1];
        }

        return cookies[cookieName];
    },

    /**
     * Creates a cookie
     * @param cookieName : a name identifier
     * @param cookieValue : a value association
     * @param config : object of additional cookie configuration example: {expires: 'Thu Aug 14 2014 19:52:13 GMT+0100 (BST)', path: '/', domain: '.sky.com'"
     */

    setCookie: function(cookieName, cookieValue, config) {
//        this.deleteCookie(cookieName);

       var newCookie = cookieName +"="+ cookieValue;

       if (config) {


           if (typeof config.expires === 'number') {
               var days = config.expires, expires = config.expires = new Date();
               expires.setTime(+expires + days * 864e+5);

           }

           var cookieConfig = {
               expires: config.expires ? ';expires=' + config.expires : '',
               domain: config.domain ? ';domain=' + config.domain : '',
               path: config.path ? ';path=' + config.path : ''
           }

           newCookie += cookieConfig.path+cookieConfig.expires+cookieConfig.domain;
       }

        document.cookie=newCookie + ";";
    },

    deleteCookie: function delete_cookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
};

module.exports = utils;