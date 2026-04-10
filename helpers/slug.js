// xử lý tiếng Việt có dấu 
const slugify = require('slugify'); 
function makeSlug(text) { 
    return slugify(text, { 
        lower: true, strict: true, locale: 'vi' 
    }); 
} 
module.exports = { makeSlug };