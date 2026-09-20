const { PassThrough } = require('stream');
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

const retrieveURL = (req, res) => {
    const query = 'SELECT id, short_code, original_url, time_stamps FROM shorter_url WHERE short_code = ?';
    const short_code = req.params.shortCode;

    db.query(query, [short_code], (err, result) => {
        if (err) return res.status(404).json({error: "Data Not Found", errMess: err.message});

        if (result) {
            res.status(200).json({
                message: 'Successfully retrieved URL',
                data: result
            })
        };
    })
}

const updateURL = (req, res) => {
    const {error, value} = urlValidation.validate(req.body); //data url baru
    if(error) return res.status(400).json({error: "Empty String Detected"}); //validasi empty string
    const shortCode = req.params.shortCode; //ngambil shortcode dari params
    const query = 'UPDATE shorter_url SET original_url = ? WHERE short_code = ?';
    const newOriginalURL = new URL(value.originalUrl);

    try {
        if (newOriginalURL.protocol !== 'http:' && newOriginalURL.protocol !== 'https:') return res.status(400).json({error: "Invalid Protocols"});
    }catch (error) {
        console.log(error.message);
        return;
    }

    db.query(query, [newOriginalURL, shortCode], (err, result) => {
        if (err) return res.status(500).json({errorMessage: err.message});

        if(result.affectedRows > 0) {
            return res.status(200).json({
                message: "Update Successfull"
            });
        };
    });
};

const deleteURL = (req, res) => {
    const deleteQuery = 'DELETE FROM shorter_url WHERE short_code = ?'
    const shortCode = req.params.shortCode;

    db.query(deleteQuery, [shortCode], (err, result) => {
        if (err) return res.status(500).json({
            message: err.message
        });

        if(result.affectedRows === 1) {
            return res.status(204);
        }else {
            return res.status(404).json({
                message: 'No URL Found'
            });
        };
    });
};

const getURLstats = (req, res) => {
    const query = 'SELECT id, short_code, original_url, click_count, time_stamps FROM shorter_url WHERE short_code = ?';
    const shortCode = req.params.shortCode;

    db.query(query, [shortCode], (err, result) => {
        if (err) return res.status(500).json({message: err.message});

        if(result) {
            return res.status(200).json({
                message: 'Successfully retrieved url Stats',
                data: result
            });
        };
    });
};

module.exports = { postOriginalUrl, retrieveURL, updateURL, deleteURL, getURLstats }; 