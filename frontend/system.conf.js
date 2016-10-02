SystemJS.config({
    defaultJSExtensions: true,

    baseURL: '/build/script',
    map: {
        "interact.js": "//cdnjs.cloudflare.com/ajax/libs/interact.js/1.2.6/interact.min.js",
    },
    meta: {
        "interact.js": { integrity: "sha256-/19rKBLO102vP1Y82eny8uZboVUQawuiWJU0QDmxk5k=", crossOrigin: "anonymous" },
        "build/**/*": { format: "register" }
    }
});