const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

const port = process.env.PORT || 10000

mongoose.connect('mongodb://localhost/urlShortener',{
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req,res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req,res) => {
    try{
        await ShortUrl.create({ full: req.body.fullUrl })
    }
    catch(e){
        console.log(e)
    }
    res.redirect('/')
})

app.get('/:shortUrl', async (req,res) => {
  const shortUrl =   await ShortUrl.findOne({ short: req.params.shortUrl })
  if(shortUrl == null) return res.sendStatus(404)

  shortUrl.visitCount++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(port,() => console.log(`Listening on port ${port}`));