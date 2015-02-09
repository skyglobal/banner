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