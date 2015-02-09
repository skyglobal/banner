var Banner = require('./utils/banner')

new Banner({
    id: 'cookie-wrapper',
    header: 'This website uses cookies',
    message: 'Cookies remember you so we can give you a better service online. By using this website or closing this message, you are agreeing to our <a href="http://help.sky.com/security/privacy/privacy-and-cookies-notice#tab-1" name="masthead-message-text_cookie-wrapper:cookies-notice">Cookies notice</a>.',
    action: 'Cookies explained',
    callback: "http://help.sky.com/security/privacy/cookies-explained/",
    remember: 365
});