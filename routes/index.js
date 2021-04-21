var express = require('express');
var router = express.Router();
var fs = require('fs');

const {
  Pool,
  Client
} = require('pg')

const pool = new Pool({
  database: 'universitet',
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  host: 'localhost'
})

let formObj = {}
let insertObj = {}
let selectrows

router.post('/updateuser', async (req, res) => {
  formObj = {
    fam: req.body.fam,
    name: req.body.name,
    post: req.body.post,
    id: req.body.id_teacher
  }
  pool.connect((err, client) => {
    if(err) throw err
    client.query(`UPDATE teacher SET fam = '${formObj.fam}', name = '${formObj.name}', surname = '${formObj.surname}', post = '${formObj.post}' WHERE id_teacher = '${formObj.id}'`)
  })
  res.redirect('/');
})

router.post('/createuser', async (req, res) => {
  insertObj = {
    fam: req.body.fam,
    name: req.body.name,
    surname: req.body.surname,
    post: req.body.post
  }

  pool.query(`INSERT INTO teacher(fam, name, surname, post) VALUES ( '${insertObj.fam}', '${insertObj.name}', '${insertObj.surname}', '${insertObj.post}' )`), (err, res) => {
    console.log(err, res)
    pool.end()
  }

  console.log(insertObj)
  res.redirect('/createpage');
})
router.get('/createpage', function (req, res, next) {
  res.render('createpage', {
    title: 'CreateUser',
    isCreate: true
  });
});

router.get('/selectpage', (req, res) => {
  console.log('/selectpage')
  pool.connect((err, client, done) => {
    if (err) return done(err)

    client.query('SELECT * FROM public.teacher', (err, resoleve) => {
      done()
      if (err) {
        return console.error('query error', err.message, err.stack)
      }
      selectrows = resoleve.rows

      res.render('selectpage', {
        title: 'Select Page',
        selectrows,
        isSelect: true
      })
    })
    if (req.query.id_teacher) {
      client.query(`DELETE FROM public.teacher WHERE id_teacher= ${req.query.id_teacher}`)
      res.redirect('/selectpage')
    }
  })
})
router.post('/update', async (req, res) => {
  formObj = {
    fam: req.body.fam,
    name: req.body.name,
    surname: req.body.surname,
    post: req.body.post,
    id: req.body.id,
  }
  console.log(formObj);
  pool.connect((err, client) => {
    if (err) throw err
    client.query(
      `UPDATE teacher SET fam = '${formObj.fam}', name = '${formObj.name}', surname = '${formObj.surname}', post = '${formObj.post}' WHERE id_teacher = '${formObj.id}'`
    )
  })
  res.redirect('/selectpage')
})
/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', {
    title: 'Update',
    isHome: true
  });
});

module.exports = router;