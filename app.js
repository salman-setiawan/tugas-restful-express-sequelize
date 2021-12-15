// import module
const express = require('express')
const cors = require('cors')
const Sequelize = require('sequelize')

// konfig sequelize
const sequelize = new Sequelize('hewan', "root", "", {
    host : 'localhost',
    dialect: "mysql"
})

// cek koneksi
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .then(() => {
    Hewan.sync().then(()=> console.log('table hewan created'));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// model tabel
const Hewan = sequelize.define('hewan', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    nama : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    namaSpesies : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    umur : {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
})

// inisialisasi server
const app = express()
const port = 3000

// middleware
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// route awal
app.get('/', (req, res) => {
    res.send("Halo ini restful api hewan")
})

// route get all hewan
app.get('/hewan', (req, res) => {
    try {     
        Hewan.findAll({
            raw: true
        }).then(result => {
            res.status(200).json(result)
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

// route get by id
app.get('/hewan/:id', (req, res) => {
    try {        
        Hewan.findOne({
            where: {
                id: req.params.id
            },
            attributes : ["nama", "namaSpesies", "umur"]
        }).then(result => {
            res.status(200).json(result)
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

// route post
app.post('/hewan', (req, res) => {
    const {nama, namaSpesies, umur} = req.body
    try {     
        const newHewan = {
            nama : nama,
            namaSpesies : namaSpesies,
            umur : umur
        }
        Hewan.create(newHewan)
        .then(result => {
            res.status(201).json({
                message : "new hewan created",
                result
            })
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

// route update
app.put('/hewan/:id', (req, res) => {
    const hewanId = req.params.id
    const {nama, namaSpesies, umur} = req.body
    try {
        const updateHewan = {
            nama : nama,
            namaSpesies : namaSpesies,
            umur : umur
        }
        Hewan.update(updateHewan, {
            where : {
                id: hewanId
            }
        }).then(result => {
            res.status(201).json({
                message : "update hewan success",
                updateHewan
            })
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

// route delete
app.delete('/hewan/:id', (req, res) => {
    const hewanId = req.params.id;
    try {
        Hewan.destroy({
            where: {
                id: hewanId
            }
        }).then(result => {
            res.status(201).json({
                message: "hewan was deleted succesfully",
            })
        })
    } catch (error) {
        res.status(500).send(error)     
    }
})


// server
app.listen(port, () => {
  console.log(`Restful api listening at http://localhost:${port}`)
})