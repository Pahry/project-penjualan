var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');


/**
 * Tampil Barang
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM barang ORDER BY id_barang', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('posts/index', {
                data: rows // <-- data posts
            });
        }
    });
});

// Tambah Barang
 router.get('/tambahBarang', function (req, res, next) {
    res.render('posts/tambah_barang', {
        nama_barang: '',
        stok: '',
        jenis_barang: ''
    })
})

/**
 * Simpan Barang
 */
router.post('/tambahBarangAksi', function (req, res, next) {
    
    let nama_barang = req.body.nama_barang;
    let stok        = req.body.stok;
    let jenis_barang= req.body.jenis_barang;
    let errors  = false;


    // if no error
    if(!errors) {

        let formData = {
            nama_barang: nama_barang,
            stok: stok,
            jenis_barang: jenis_barang
        }
        
        // insert query
        connection.query('INSERT INTO barang SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('posts/tambahBarang', {
                    nama_barang: formData.nama_barang,
                    stok: formData.stok,
                    jenis_barang: formData.jenis_barang                    
                })
            } else {                
                req.flash('success', 'Data Barang Berhasil Ditambahkan!');
                res.redirect('/posts');
            }
        })
    }

})


// Edit Barang
router.get('/editBarang/(:id_barang)', function(req, res, next){
    
    let id_barang = req.params.id_barang;
    

    connection.query('SELECT * FROM barang WHERE id_barang = ' + id_barang, function(err, rows, fields){
        if(err) throw err;
        
        if(rows.length <= 0){
            req.flash('error', 'Data Post dengan ID Barang ' + id_barang + " Tidak Ditemukan")
            res.redirect('/posts');
        }else{
            res.render('posts/editBarang',{
                id_barang: rows[0].id_barang,
                nama_barang : rows[0].nama_barang,
                stok: rows[0].stok,
                jenis_barang: rows[0].jenis_barang
            })
        }

    })

})

// Edit Barang Aksi
router.post('/editBarangAksi/:id_barang', function(req, res, next){

    let id_barang   = req.params.id_barang;
    let nama_barang = req.body.nama_barang;
    let stok        = req.body.stok;
    let jenis_barang = req.body.jenis_barang;
    let errors      = false;

    if( !errors){
        let formData = {
            nama_barang  : nama_barang,
            stok         : stok,
            jenis_barang : jenis_barang
        }

        // Update Query
        connection.query('UPDATE barang SET ? WHERE id_barang = ' + id_barang, formData, function(err, result){
            // if(err) throw err
            if(err){
                // Set Flash Message
                req.flash('error', err)
                // render to Edit Barang
                res.render('posts/editBarang',{
                    id_barang: req.params.id_barang,
                    nama_barang: formData.nama_barang,
                    stok: formData.stok,
                    jenis_barang: formData.jenis_barang
                })
            }else{
                req.flash('success', 'Data Barang Berhasil Diupdate');
                res.redirect('/posts');
            }
        })
    }
})

// Hapus barang
router.get('/hapusBarang/(:id_barang)', function (req, res, next){

    let id_barang = req.params.id_barang;
    
    connection.query('DELETE FROM barang WHERE id_barang = ' + id_barang, function(err, result){
        
        if(err){
            req.flash('error', err);
            res.redirect('/posts');
        }else{
            req.flash('success', 'Data Berhasil Dihapus');
            res.redirect('/posts');
        }

    })
})

router.get('/transaksi', function (req, res, next) {
    //query
    connection.query('SELECT b.nama_barang, t.tanggal_transaksi,t.jumlah_terjual,b.stok,t.id_transaksi FROM barang b JOIN transaksi t ON b.id_barang = t.id_barang ORDER BY tanggal_transaksi DESC', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts/transaksi', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('posts/transaksi', {

                data: rows // <-- data posts
            });
        }
    });
});

// Tambah Transaksi
router.get('/posts/tambahTransaksi', function (req, res, next) {
    connection.query('SELECT * FROM barang', function(err,rows,fields){
        if(err) throw err;
        res.render('posts/tambah_transaksi',{
        data: rows
        });
        
    });
});

// Tambah Transaksi Aksi
router.post('/tambahTransaksiAksi', function (req, res, next) {
    
    let id_barang = req.body.nama_barang;
    let jumlah_terjual= req.body.jumlah_terjual;
    let tanggal_transaksi = req.body.tanggal_transaksi;
    let errors  = false;

    // if no error
    if(!errors) {

        let formData = {
            id_barang: id_barang,
            jumlah_terjual: jumlah_terjual,
            tanggal_transaksi: tanggal_transaksi
        }
        
        // insert query
        connection.query('INSERT INTO transaksi SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('posts/tambahTransaksi', {
                    id_barang: formData.id_barang,
                    jumlah_terjual: formData.jumlah_terjual                    
                })
            } else {                
                req.flash('success', 'Data Transaksi Berhasil Ditambahkan!');
                res.redirect('/posts/transaksi');
            }
        })
    }

})


// Hapus Transaksi
router.get('/hapusTransaksi/(:id_transaksi)', function (req, res, next){

    let id_transaksi = req.params.id_transaksi;

    connection.query('DELETE FROM transaksi WHERE id_transaksi = ' + id_transaksi, function(err, result){
        
        if(err){
            req.flash('error', err);
            res.redirect('/posts/transaksi');
        }else{
            req.flash('success', 'Data Transaksi Berhasil Dihapus');
            res.redirect('/posts/transaksi');
        }

    })
})

router.get('/home', function (req, res, next) {
    //query
    connection.query('SELECT b.*, t.* FROM barang b JOIN transaksi t ON b.id_barang = t.id_barang ORDER BY tanggal_transaksi DESC', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts/home', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('posts/home', {
                data: rows // <-- data posts
            });
        }
    });
});

router.get('/rekap', function(req,res,next){
    connection.query("SELECT t.*,b.* FROM transaksi t JOIN barang B ON t.id_barang=b.id_barang", function(err,rows){
        if (err) {
            req.flash('error', err);
            res.render('posts/rekap', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('posts/rekap', {
                data: rows // <-- data posts
            });

        }
    });
});


router.post('/rekapAksi', function(req,res,next){
    
    let dari = req.body.dari;
    let sampai = req.body.sampai;
    let errors = false;

    if(!errors) {
                    connection.query("SELECT t.*,b.* FROM transaksi t JOIN barang B ON t.id_barang=b.id_barang WHERE t.tanggal_transaksi BETWEEN ('" +dari+"')AND('" +sampai+"')",function(err,rows,fields){
                        if(err) throw err;
                        
                        res.render('posts/rekap_aksi',{
                            data:rows
                        })
                    })
                }        
    
});

module.exports = router;