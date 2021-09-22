const express = require('express');
const bdy = require('./salesorder.json');
const app = express();
require('dotenv').config();
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var XMLHttpRequest = require('xmlhttprequest-ssl')


var x = Date.now()
// var y = 
// console.log(x)


bdy.PricingDate = '/Date(' + x + ')/';
bdy.RequestedDeliveryDate =  '/Date(' + x + ')/';
bdy.CustomerPurchaseOrderDate = '/Date(' + x + ')/';

console.log('The payload for creating sales order : ',bdy);


app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine' , 'ejs');

//  mongoose connect
// url = 'mongodb+srv://user1:123abc@cluster0.zv8qh.mongodb.net/lunchDB?retryWrites=true&w=majority'
// create mongoose connection to the db 

// const  config = require('./config/database');

// mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});

//  define model of the data object,

const Lunch = mongoose.model('Lunch',
        {   empName: String ,
            empId: String,
            dateTime: String,
            myChoices : [{
                food:String
            }]
        }
        );

//  insert the choice should be called in the post method
//  Assumption is that food is already there in dropdown.

var XMLHttpRequest = require('xmlhttprequest-ssl')
var xhr = new XMLHttpRequest();
var productdata = {};
var product = "";
var ProductDescription = "";
xhr.withCredentials = false;

// bdy.ExternalDocLastChangeDateTime = Date().toLocaleString();

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
    
    productdata = this.responseText;
  }

});


app.post('/lunch' , function(req,res){

    var myLunchChoice = {
        empName: req.body.empName,
        empId: req.body.empId,
        dateTime : Date().toLocaleDateString(),
        myChoices : [{
            food:req.body.food
        }]
    }

    Lunch.insertMany(myLunchChoice, function(err, docs){
        if (err) {
            console.log(err)
        } else {
            console.log(docs)
        }
    })

})



var cart = [];
// get to the home route

app.get('/' , function(req,res){
    res.render('lunch')
})

app.get('/vegetarian',function(req,res){
    res.render('vegetarian' , {cart: cart})
    
})

//  Save to S4 IC2021 as Sales Order
app.post('/toErp', function(req,res){
    // console.log('Cart : ',req.body.cart);

    var mycart = [];
    mycart = req.body.cart;
    mycart = '[' + mycart + ']';
    mycart = JSON.parse(mycart);
    var product = [];   


    // mycart = JSON.parse(JSON.stringify(mycart));
    // console.log(typeof(mycart));
    // jsCart = mycart;
    // console.log('App js for objects' , jsCart[1].productname);
    //  Algorithm
    // Get the length of the object mycart.
    // Loop for the length of the object mycart
    //  create another object {product:productName , productQty : quantity}
    // if the first item is equal to the next - then increase the count. 

    

    for(var i = 0; i < mycart.length; i++){
        
       
        // console.log('The cart has following items: ',mycart[i]); // Object with id and time
        // console.log(mycart[i].productname);
        
        product.push(mycart[i].productname);
        

    }

    console.log(product)



    const countUnique = product => {
        const counts = {};
        for (var i = 0; i < product.length; i++) {
           counts[product[i]] = 1 + (counts[product[i]] || 0);
        };
        return  counts;
     };

     console.log('Unique Products and their counts: ',countUnique(product));

     productQtyArray = JSON.parse(JSON.stringify(countUnique(product)))
    
     console.log('Json  ',productQtyArray[0])
    
    // var sampleArray = mycart.split(',');
    // console.log('In App.js',sampleArray)
    // const counts = {};
    
    // sampleArray.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
    // console.log('Each Item Counts: ',counts)
    
    let username = 'I304524';
    let password = 'Welcome4';

var auth = 'Basic ' + Buffer.from(username + ":" + password).toString('base64');
//setting request method

for (var i = 0 ; i < 1 ; i ++ ){
  var data ="";  
// Pass Product Number
// product = String(req.body.product) + "-" + i;

bdy.to_Item.results[0].Material= product[0];
bdy.to_Item.results[1].Material= product[1];

    }
data = JSON.stringify(bdy);

      // "http://10.79.14.227:50000/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product"

// url = "http://10.79.14.227:50000/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('2')"
// Create Sales order 
url = "http://10.79.14.227:50000/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder"
  
  // console.log(url);
  xhr.open("POST", url);

//   Update Sales order - only works where line item exists.
// url = "http://10.79.14.227:50000/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrderItem(SalesOrder=%274279%27,SalesOrderItem=%2710%27)"

// xhr.open("PATCH", url);


// Create Sales order new line item for a new date
// url = "http://10.79.14.227:50000/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder(%274279%27)/to_Item"

// xhr.open("POST", url);


//   // console.log(url);
//   xhr.open("POST", url);



  //adding request headers
  xhr.setRequestHeader("DataServiceVersion", "2.0");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Apikey","BgBF6Dn2vuWpKjY4YxWfU8sjmfzldTdC")
  xhr.setRequestHeader('Authorization', auth)
  xhr.setRequestHeader("X-Requested-With", "X");

  xhr.send(data);
  
// }

// res.write(data);
// res.send();
res.redirect('/')

})

app.get('/cart',function(req,res){
    res.render('cart')
})

app.get('/nonveg',function(req,res){
    res.render('nonveg')
})

app.get('/smart',function(req,res){
    res.render('smart')
})

app.get('/sustain',function(req,res){
    res.render('sustain')
})

const PORT = process.env.PORT || 3000;

app.listen(PORT , function(){console.log(`lunch app running at port ${PORT}`)})