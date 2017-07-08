System.config({
    baseURL: '/build/script',
    map: {
        "interact.js": "//cdnjs.cloudflare.com/ajax/libs/interact.js/1.2.8/interact.min.js"
    },
    meta: {
        "interact.js": { crossOrigin: "anonymous" }
    },
    packages: {
        '': {
            defaultExtension: 'js'
        }
    }
});