const PROXY_CONFIG = [
    {
        context: [
            "/api",
        ],
        target: process.env.API_URL,
        secure: false
    }
]

module.exports = PROXY_CONFIG;
