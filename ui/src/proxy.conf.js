const PROXY_CONFIG = [
    {
        context: [
            "/api",
        ],
        target: "http://localhost:40080",
        secure: false
    }
]

console.log(process.env["API_URL"])

module.exports = PROXY_CONFIG;
