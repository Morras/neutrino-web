System.config({
    baseURL: '/build/script',
    map: {
        "interact.js": "//cdnjs.cloudflare.com/ajax/libs/interact.js/1.2.8/interact.min.js"
    },
    meta: {
        "interact.js": { integrity: "sha256-oiIq1QmFx42S31Z5PspPR4rAPxGJpvF+wsVsdPRaUzM=", crossOrigin: "anonymous" },
    },
    packages: {
        '': {
            defaultExtension: 'js'
        }
    }
});