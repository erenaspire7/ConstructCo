module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        maxHeight: {
            'table': "86%"
        },
        extend: {
            backgroundImage: {
                'hero': "url('assets/img/hero.jpg')",
            },
            backgroundColor: {
                'teal': '#0E7C7B',
                'ruby': '#852632',
                'sapphire': '#0F5373'
            }
        },
    },
    variants: {
        extend: {
            animation: ['hover']
        },
    },
    plugins: [],
}
