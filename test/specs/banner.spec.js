document.body.innerHTML = __html__['_site/index.html'];

var banner = skyComponents['banner'];

//banner.init(); //live events don't init for karma, so init them here if you need to

describe('banner module can ', function () {

    it('sum an array of numbers', function () {

        expect(banner.sum([1,2,3])).toBe(6);

    });

});