const db = require('../config/database');
const urlValidation = require('../config/schema');
const crypto = require('crypto');
const { URL } = require('url');


const postOriginalUrl = (req, res) => {
    //validasi empty string
    const { error, value } = urlValidation.validate(req.body);
    if (error) return res.status(400).json({
        errMess: 'Empty String Detected !!'
    });

    //validasi protocol && hostname
    try {
        const validatedUrl = new URL(value.originalUrl);
        
        if (validatedUrl.protocol !== 'http:' && validatedUrl.protocol !== 'https:') {
            return res.status(400).json({ error: 'Unknown Protocols !!!'});
        };
        
        if (validatedUrl.hostname === 'localhost') {
            return res.status(400).json({ error: 'Self Hostname Detected !!!'});
        }
    }catch (error) {
        return res.status(400).json({ error: 'OriginalURL Not Valid !!!'});
    };

    //post query execution
    const postQuery = 'INSERT INTO SHORTER_URL (short_code, original_url) VALUES (?, ?)';
    const validatedUrl = value.originalUrl;
    const buf = crypto.randomBytes(3);
    const shortCode = buf.toString('hex'); //short code

    db.query(postQuery, [shortCode, validatedUrl], (error, result) => {

        if (error) return res.status(400).json({error: 'Query Execution Error', message: error.message});

        res.status(201).json({
            id: result.insertId,
            short_code: shortCode,
            original_url: validatedUrl,
            click_count: 0,
            created_at: new Date().toISOString()
        });
    });
};

module.exports = { postOriginalUrl }; 