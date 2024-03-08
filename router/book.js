const express = require('express')
const router = express.Router();
const Book = require('../model/bookSchema')
const { multer, storage } = require('../middleware/multerconfig');
const fs = require('fs')
const upload = multer({ storage })

//post book
router.post('/', upload.single("image"), async (req, res) => {
    let fileName;
    console.log(req.file)
    const imagesize = ((req.file.size) / (1024 * 1024)).toFixed(2);
    console.log(imagesize)
    if (imagesize > 5) {
        res.status(400).json({ message: 'file should lessthan equal to 5Mb' })
    }
    if (req.file) {
        fileName = "http://localhost:3000/" + req.file.filename
    } else {
        fileName = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    }
    const { name, price, isbn, author, publication, publishAt } = req.body;
    try {
        const book = await Book.create({
            name,
            price,
            isbn,
            author,
            publication,
            publishAt,
            imageUrl: fileName
        })
        res.status(201).json({ data: book, message: 'book successfully created' })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
})

//read all book
router.get('/', async (req, res) => {
    try {
        const books = await Book.find()
        if (!books) {
            res.status(400).json({ message: 'unable to find book' })
        }
        res.status(200).json({ data: books })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
})

//read one book

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findById(id)
        if (!book) {
            res.status(404).json({ message: 'unable to find book' })
        }
        res.status(200).json({ data: book, message: 'successfully fetched' })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
})

//delete book
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const book = await Book.findByIdAndDelete(id)
        const oldImagePath = book.imageUrl;
        const localhostUrlLength = "http://localhost:3000/".length;
        const newOldImagePath = oldImagePath.slice(localhostUrlLength);
        fs.unlink(`./storage/${newOldImagePath}`, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('file deleted successfully')
            }
        })
        res.status(200).json({ message: 'book successfully deleted' })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
})

//update book

router.patch('/:id', upload.single('image'), async (req, res) => {
    const { name, price, isbn, author, publication, publishAt } = req.body;
    let fileName;

    try {

        const oldData = await Book.findById(req.params.id);
        if (req.file) {
            const imagesize = ((req.file.size) / (1024 * 1024)).toFixed(2);
            if (imagesize > 5) {
                res.status(400).json({ message: 'file should lessthan equal to 5Mb' })
            }
            if (oldData && oldData.imageUrl) {
                const oldImagePath = oldData.imageUrl.replace('http://localhost:3000/', '');
                fs.unlink(`./storage/${oldImagePath}`, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File successfully deleted old image');
                    }
                });
            }

            // Set the new image URL
            fileName = 'http://localhost:3000/' + req.file.filename;
        } else {
            fileName = oldData.imageUrl;
        }

        // Update book information
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
            name,
            price,
            isbn,
            author,
            publication,
            publishAt,
            imageUrl: fileName
        });

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book successfully updated' });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;