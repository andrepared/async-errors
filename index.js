const express = require('express');
const app = express(); 
const path = require('path'); 
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Product = require('./models/product') 
const AppError = require('./appError'); 



mongoose.connect('mongodb://localhost:27017/farmStand')
    .then(() => {
        console.log('MONGO CONNECTION NOW OPEN');
    }).catch(err => {
        console.log('OH NO, MONGO CONNECTION ERROR');
        console.log(err);
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetables', 'dairy']


app.get('products/new', (req, res) => {
    throw new AppError('Not Allowed', 401); 
    res.render('/products/new', { categories });
})

app.get('/products', async (req, res) => {
    const { category } = req.query; 
    if (category) {
        const products = await Product.find({category})
            res.render('products/index', { products })

    } else {
        const products = await Product.find({});
        res.render('products/index', { products, categories: 'All' })
    }
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save(); 
    res.redirect(`/products/${newProduct._id}`)
})


app.get('/products/:id', async (req, res) => {
     const { id } = req.params;
    const product = await Product.findById(id)
    console.log(product);
    res.render('products/show', { product })
})
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', { product })
})
app.put('/products/:id', async (req, res) => {
    const { id } = req.params; 
    const product = Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true});
    console.log(req.body);
    res.redirect('/products/${products._id}')
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params; 
    const deletedProduct = await Product.findByIdAndDelete(id)
    res.redirect('/products');
})


app.listen(3000, () => {
    console.log('APP IS LISTENING ON PORT 3000!!!!!')
})

