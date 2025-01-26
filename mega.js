const mega = require("megajs");

// Authentication details
const auth = {
    email: 'sanarathnas0@gmail.com',
    password: 'Sena11@#usn',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

/**
 * Uploads a file to MEGA.
 * @param {ReadableStream} data - The readable stream of the file to upload.
 * @param {string} name - The name of the file to be uploaded.
 * @returns {Promise<string>} - Resolves with the public URL of the uploaded file.
 */
const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        try {
            const storage = new mega.Storage(auth, () => {
                const uploadStream = storage.upload({ name, allowUploadBuffering: true });
                data.pipe(uploadStream);

                storage.on("add", (file) => {
                    file.link((err, url) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(url);
                        }
                        storage.close();
                    });
                });
            });

            storage.on("error", (err) => {
                reject(err); // Catch storage-related errors
                storage.close();
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { upload };
