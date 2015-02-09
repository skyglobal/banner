(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Banner = require('./utils/banner')

new Banner({
    id: 'cookie-wrapper',
    header: 'This website uses cookies',
    message: 'Cookies remember you so we can give you a better service online. By using this website or closing this message, you are agreeing to our <a href="http://help.sky.com/security/privacy/privacy-and-cookies-notice#tab-1" name="masthead-message-text_cookie-wrapper:cookies-notice">Cookies notice</a>.',
    action: 'Cookies explained',
    callback: "http://help.sky.com/security/privacy/cookies-explained/",
    remember: 365
});
},{"./utils/banner":2}],2:[function(require,module,exports){
var utils = require('./utils')


/**
 * Creates a notification message on the page
 * @param config object containing the properties: ...
 */
var Banner =  function(config) {

    this.closeJSHook = 'js-close';

    this.defaults = {
        close: 'Close',
        theme: 'grey'
    };

    this.config = utils.extend(this.defaults, config);

    this.init();
};

Banner.prototype = {
    init: function() {
        this.idfy();

        if(!this.checkIfBannerHasBeenSeen()) {
            this.html = this.createBanner();
            this.bindEvents();
        }
    },

    idfy: function() {
        if (this.config.id) {
            this.id = this.config.id = this.config.id.replace(/ /g,'-');
        }
    },

    checkIfBannerHasBeenSeen: function () {
        return (utils.getCookie(this.config.id) == "seen");
    },

    bindEvents: function () {
        var self = this;

        this.showBannerListener = function() {
            self.showBanner();
        }

        document.addEventListener('DOMContentLoaded', self.showBannerListener);

        this.deleteBannerListener = function() {
            self.deleteBanner();
        };

        var close = this.html.querySelector("." + this.closeJSHook);
        close.addEventListener('click', self.deleteBannerListener);
    },

    unbindEvents: function() {
        if (document.removeEventListener) {
            document.removeEventListener('DOMContentLoaded', this.showBannerListener);
        } // else it's old IE

        var close = this.html.querySelector("." + this.closeJSHook);
        close.removeEventListener('click', this.deleteBannerListener);
    },

    createBanner: function() {
        var banner = document.createElement('div');
        banner.className = 'skycom banner';

        if(this.config.theme) {
            banner.className = this.setBannerTheme(banner.className);
        }

        var content = document.createElement('div');
        content.className = 'banner__content';
        banner.appendChild(content);

        var closeButton = this.createCloseButton();
        content.appendChild(closeButton);

        if (this.config.theme.toLowerCase() === 'warning') {
            var icon = document.createElement('i');
            icon.className = 'sprite-warning';
            content.appendChild(icon);
            content.className += ' skycom-message-offset';
        }

        var header = document.createElement('h2');
        header.className = 'banner__heading';
        header.appendChild(document.createTextNode(this.config.header))
        content.appendChild(header);

        var message = document.createElement('p');
        message.className = 'banner__message';
        message.innerHTML = this.config.message; // TODO: don't allow HTML in config.message
        content.appendChild(message);

        if (this.config.action) {
            var primaryAction = this.createActionLink(this.config.action, this.config.callback);
            content.appendChild(primaryAction);
        }

        if (this.config.secondaryAction) {
            var secondaryAction = this.createActionLink(this.config.secondaryAction, this.config.secondaryActionCallback);
            content.appendChild(secondaryAction);
        }

        return banner;
    },

    setBannerTheme: function(bannerClass) {
        return bannerClass + " banner--" + this.config.theme;
    },

    createActionLink: function(message, callBackOrAction) {

        var link = document.createElement('a');

        link.className = 'banner__action';
        var icon = document.createElement('i');
        icon.className = 'skycon-chevron';

        link.appendChild(icon);
        link.appendChild(document.createTextNode(message));

        if(callBackOrAction) {
            if(typeof callBackOrAction== 'function') {
                link.addEventListener('click', callBackOrAction);
            } else {
                link.href = callBackOrAction;
            }
        }

        return link;
    },

    createCloseButton: function() {
        var link = document.createElement('a');
        link.className = 'js-close banner__close';
        link.appendChild(document.createTextNode(this.config.close));
        var icon = document.createElement('i');
//        icon.className = this.config.theme === 'blue' ? 'sprite-close-dark' : 'sprite-close-light';
        icon.className = "skycon-close";
        link.appendChild(icon);
        return link;
    },

    showBanner: function() {
        var parent = document.body;
        parent.insertBefore(this.html, parent.firstChild);
    },

    deleteBanner: function () {
        this.unbindEvents();

        if(this.config.remember) {
            this.remember();
        }

        document.body.removeChild(this.html);
    },

    remember: function() {

        var cookieConfig = {
                domain: (location.hostname.match(/sky.com/)) ? 'sky.com' : '',
                path: '/',
                expires: this.config.remember || ''
            };

        utils.setCookie(this.config.id, 'seen', cookieConfig);

    }
};

module.exports  = Banner;
},{"./utils":3}],3:[function(require,module,exports){
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
},{}]},{},[1]);
