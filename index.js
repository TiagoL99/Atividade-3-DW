const PORTA =  8050
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()

const sites = [
    {
        name: 'Variety',
        address: 'https://variety.com/v/film/box-office/',
        base: '',
    },

    {
        name: 'Hollywood Reporter',
        address: 'https://www.hollywoodreporter.com/t/box-office/',
        base: '',
    },
        
    {
        name: 'Deadline',
        address: 'https://deadline.com/v/box-office/',
        base: '',
    },
        

    {
        name: 'The Numbers',
        address: 'https://www.the-numbers.com/news/',
        base: 'https://www.the-numbers.com',
    },

    {
        name: 'Box Office Pro',
        address: 'https://www.boxofficepro.com/category/forecasts-tracking/',
        base: '',
    }
    
]
    

const artigos = []

sites.forEach(site => {
    axios.get(site.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Box Office")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')

                artigos.push({
                    title,
                    url: site.base + url,
                    source: site.name
                })
            })


        })
})

app.get('/', (req,res) => {
    res.json('Bem-Vindo à API de noticias sobre Box Office de filmes!')
})

app.get('/boxoffice', (req,res) => {
    res.json(artigos)
})

app.get('/boxoffice/:siteID', async (req,res) => {
    const siteID = req.params.siteID

    const enderecoNoticias = sites.filter(site => site.name == siteID)[0].address
    const siteBase =  sites.filter(site => site.name == siteID)[0].base

    axios.get(enderecoNoticias)
        .then(response => {
            const html = response.data 
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Box Office")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: siteBase + url,
                    source: siteID
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

        console.log(enderecoNoticias)
})

app.listen(PORTA, () => console.log(`Servidor a correr na porta ${PORTA}`))