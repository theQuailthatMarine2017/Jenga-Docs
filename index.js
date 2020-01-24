const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createclienttoken } = require('./jwtoken');
const Client = require('./Models/Client');
const File = require('./Models/Files');
var multer  = require('multer');
const fs = require('fs');
var path = require('path');
var upload = multer({ dest: 'uploads/receipts' });
var upload2 = multer({ dest: 'uploads/invoices'});
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const base64 = require('base64topdf');
const Joi = require('@hapi/joi');
const serveStatic = require('serve-static')

const app = express()


app.use(cors());
app.use(express.json());

//Validation Functions 

const schemaRegister = Joi.object({
    
    names: Joi.string().required(),
    email: Joi.string().required().email(),
    mobile: Joi.number().required(),
    pin: Joi.string().min(4).required()
});

const schemaLogin = Joi.object({
    
    mobile: Joi.number().required(),
    pin: Joi.string().min(4).required()

});

//Nodemailer Transport Setting
var transport = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'jenga.docs@gmail.com',
    pass: 'theoracle'
  }
}));

mongoose.connect( process.env.MONGOLAB_MAUVE_URI,
                 { useNewUrlParser : true },
                () => console.log(`connected to database status: ${mongoose.connection.readyState}`));



//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, 'client/dist')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, 'client/dist/index.html'))
})


// New Client Account
app.post('/api/jenga/register', async (req,res) => {

	console.log(req.body)
  // Validate Incoming Body
    const {error} = schemaRegister.validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {

         // Prepare to Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.pin, salt);

        //New Client Created
        const client = new Client({

            names: req.body.names,
            email: req.body.email,
            mobile:req.body.mobile,
            pin: hashedPassword

        });

        const newclient = await client.save();

        console.log("new" + newclient)

        const token = createclienttoken(newclient._id);

        console.log(token)

        res.status(200).json({
            title: 'created',
            token: token,
            newclient
        });

    } catch (err) {

        res.send(err);
    }


});

app.get('/api/test',(req,res) => {

  res.send('ksksks');
})

//Existing Account
app.post('/api/jenga/login', async (req,res) => {

	console.log(req.body);
 

    //validate information passed
    const {error} = schemaLogin.validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {

        // check if user exists
        const client = await Client.findOne({ mobile: req.body.mobile});
        if(!client) return res.status(404).send('Client Not Found');

        //check password match
        const passValid = await bcrypt.compare(req.body.pin,client.pin);
        if(!passValid) return res.status(404).send('Password Incorrect');

        //If Both Are Good User Exists Create Token

        const token = createclienttoken(client._id);

        res.status(200).json({
            title: 'found',
            token: token,
            client
        });


        } catch(error) {

            res.send(error);
        }

});

app.get('/api/jenga/user', (req,res) => {

  let token = req.headers.token
  console.log(token)

     jwt.verify(token, 'dfbkuydgviubdlubgwudilak', async (error,decode) => {

        if (error) return res.status(401).json({
            title: error
        })

        Client.find({_id:decode._id}, function(err,account){ 

            if (err) return res.status(401).json({

                title: err

            })

            console.log(account)

            return res.status(200).json({
                title: 'admin autheticated',
                account
            })

        });

    })

});


app.post('/api/jenga/sendreceipt',upload.single('pdf'), (req,res) => {

  // Assigned Req Data To Variables

    let token = req.body.token
    let file = req.file
    let sender = req.body.emailfrom
    let sendername = req.body.fromnames.toUpperCase()

    console.log(file)
    // Client to send email body
    let clientToEmail = {

      email: req.body.clientemail,
      name: req.body.client

    }

    jwt.verify(token, 'dfbkuydgviubdlubgwudilak', async (error, decoded) => {

        if (error) return res.status(401).json({
            title: error
        })

        Client.find({_id:decoded._id}, async function(err,account){

              if (err) return res.status(401).json({
                    title: err
              })

              var receipts = new File;

              receipts.userId = decoded._id
              receipts.filePath = file.path
              receipts.fileName = file.filename

              var filePath = path.join(__dirname, receipts.filePath);

              console.log(filePath)
              
              var uploadsPath = `"/Users/admin/Sites/jenga-docs-server/uploads/receipts/${file.filename}"`

              try {
                  
                  const savedFile = await receipts.save()

                  console.log(savedFile)

                  //Send Email With File Attached If No Errors So Far
                  console.log(clientToEmail)

                  var attachments = [{ filename: file.filename, path: filePath, streamSource: fs.createReadStream(filePath), contentType: file.mimetype }];


                  var mailOptions = {
                    from: sender,
                    to: clientToEmail.email,
                    subject: `RECEIPT OF PAYMENT FROM ${sendername}`,
                    text:'',
                    html: '<!DOCTYPE html>'+
                              '<html><head><title>Receipt of Payment Received</title>'+
                              '</head><body><div>'+
                              `<h4><strong>This is an Acknowledgement of Payment By ${sendername}</strong></h4>`+
                              '<h4>Please find a copy of your receipt for your payment attached to this mail.</h4>'+
                              '<p>This is an autogenerated email, do not respond.</p>'+
                              '<p><strong>Receipts Generated By Jenga-Docs.</p>' +
                              '<p><strong>Jenga Docs is Developed By Rony Quail.</strong></p>'+
                        '</div></body></html>',
                    attachments: attachments


                  }

                  console.log(mailOptions)

                  transport.sendMail(mailOptions, function(err,info){

                    if (err) console.log(err)

                    res.status(200).json({
                      title: 'Receipt Sent!'

                    })

                    console.log(info)
                  })


              } catch (error) {

                  console.log(error)
              }

        })
    });


});

app.post('/api/jenga/sendinvoice',upload2.single('pdf'), (req,res) => {

  // Assigned Req Data To Variables

    console.log(req)
    
    let token = req.body.token
    let file = req.file
    let sender = req.body.fromemail
    let sendername = req.body.fromname.toUpperCase()

    console.log(file)

    


    // Client to send email body
    let clientToEmail = {

      email: req.body.toemail,
      name: req.body.toname

    }

    jwt.verify(token, 'dfbkuydgviubdlubgwudilak', async (error, decoded) => {

        if (error) return res.status(401).json({
            title: error
        })

        Client.find({_id:decoded._id}, async function(err,account){

              if (err) return res.status(401).json({
                    title: err
              })

              var filePath = path.join(__dirname, file.path);

              console.log(filePath)
              
              // var uploadsPath = `"/Users/admin/Sites/jenga-docs-server/uploads/receipts/${file.filename}"`

              try {
                  

                  //Send Email With File Attached If No Errors So Far
                  console.log(clientToEmail)

                  var attachments = [{ filename: file.filename, path: filePath, streamSource: fs.createReadStream(filePath), contentType: file.mimetype }];


                  var mailOptions = {
                    from: sender,
                    to: clientToEmail.email,
                    subject: `INVOICE RECEIVED FROM ${sendername}`,
                    text:'',
                    html: '<!DOCTYPE html>'+
                              '<html><head><title>Invoice Received.</title>'+
                              '</head><body><div>'+
                              `<h4><strong>You have received an Invoice from ${sendername}.Please find the invoice attached to this mail.</strong></h4>`+
                              '<p>This is an autogenerated email, do not respond.</p>'+
                              '<p><strong>Invoice Generated By Jenga-Docs.</p>' +
                              '<p><strong>Jenga Docs is Developed By Rony Quail.</strong></p>'+
                        '</div></body></html>',
                    attachments: attachments


                  }

                  console.log(mailOptions)

                  transport.sendMail(mailOptions, function(err,info){

                    if (err) console.log(err)

                    res.status(200).json({
                      title: 'Invoice Sent!'

                    })

                    console.log(info)
                  })


              } catch (error) {

                  console.log(error)
              }

        })
    });


});

const port = process.env.PORT || 3000
app.listen(port)


console.log(`app is listening on port: ${port}`)