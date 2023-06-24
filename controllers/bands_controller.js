// DEPENDENCIES
const bands = require('express').Router()
const db = require('../models')
const { Band, MeetGreet, Event, SetTime } = db
const { Op } = require('sequelize')

// ENDPOINTS
bands.get('/', async (req, res) => {
    try {
        const foundBands = await Band.findAll({
            order: [ ['available_start_time', 'ASC'] ],
            where: { name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` } },
        })
        res.status(200).json(foundBands)
    } catch(err) {
        console.log(err)
        res.status(500).send('ERROR GETTING ALL BANDS')
    }
})

bands.get('/:name', async (req, res) => {
    try {
        const foundBand = await Band.findOne({
            where: {name: req.params.name},
            include: [
                {
                    model: MeetGreet,
                    as: 'meet_greets',
                    include: {
                        model: Event,
                        as: 'event',
                        where: { name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` } }
                    }
                }, {
                    model: SetTime,
                    as: 'set_times',
                    include: {
                        model: Event,
                        as: 'event'
                    }
                }
            ]
        })
        res.status(200).json(foundBand)
    } catch(err) {
        console.log(err)
        res.status(500).send('ERROR GETTING ONE BAND')
    }
})

bands.post('/', async (req, res) => {
    try {
        const newBand = await Band.create(req.body)
        res.status(200).json({message: "Created a new band!", data: newBand})
    } catch(err) {
        console.log(err)
        res.status(500).send('ERROR CREATING BAND')
    }
})

bands.put('/:id', async (req, res) => {
    try {
        const updatedBands = await Band.update(
            req.body,
            { where: {band_id: req.params.id} }
        )
        res.status(200).json({ message: `Updated ${updatedBands} bands!`})
    } catch(err) {
        console.log(err)
        res.status(500).send('ERROR UPDATING BANDS')
    }
})

bands.delete('/:id', async (req, res) => {
    try {
        const deletedBand = await Band.destroy({ where: {band_id: req.params.id} })
        res.status(200).json({ message: `Successfully deleted band id ${req.params.id}!`})
    } catch(err) {
        console.log(err)
        res.status(500).send('ERROR DELETING BAND')
    }
})

// EXPORT
module.exports = bands