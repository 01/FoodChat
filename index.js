'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const http = require('http')
var GUEST_TOKEN = "Guest-Token"
    var AUTH_TOKEN = "Authorization"
    var GUEST_TOKEN_URL = "customer/auth/guest"
    var CUSTOMER_CART_URL = "customer/cart"
    var CHECKOUT_URL = "customer/cart"
    var CC_URL = "customer/cc"
    var AUTH_URL = "customer/auth"
    var LOCATION_URL = "customer/location"
    var ORDER_URL = "customer/orders/recent"
    var SEARCH_URL = "merchant/search/delivery"    
    var SEARCH_ADDRESS = "1330 1st Ave, 10021"
    var ADDRESS_APT = "Apt 123"    
    var CLIENT_ID = "NWFlOThkMjQ3MDZiOTMxMzc2NTAyMzg1OGE3MjJkN2Fm"    
    var ORDER_TYPE = "delivery"
    var client_secret = "r5BaqHvRH5AP8vhmkV9TrxjMUnpiKX7pB9lB9g6y"
var item 

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

 app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0 ;i < messaging_events.length ;i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Delivery Near Me') {
            getLocalMerchantList(sender)
           
        }
        else if (text == 'Large Cheese Pizza for Delivery'){
            searchItem(sender)
            
        }
       sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
        let text = JSON.ify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
       
      }
    }
    res.sendStatus(200)
  })

const token = "EAAKFQGxdLbIBAG02CThd5Btd0g5gHjRNIHLfL05cbYY0kRimUnCF2VSXDVLvjKnXZA8ZAwrGhe1A6ivPamZCVJ5jtLDmwcih2BO4LY8lAdu8aRGMV2qZCsMQ7VbZA9P5vuPZA9ESzwC9isJPtYQrhXLwVdCnfEeelulbbuBb98XAZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



function searchItem(sender){

        http.get({host:'sandbox.delivery.com', path: '/merchant/33760/menu?client_id=NWFlOThkMjQ3MDZiOTMxMzc2NTAyMzg1OGE3MjJkN2Fm&client_secret=r5BaqHvRH5AP8vhmkV9TrxjMUnpiKX7pB9lB9g6y', headers: {'Content-Type': 'application/json'}}, function(res) {
        //var response = JSON.parse(res.data)
        var data = ""
        res.on('data', function(d) {
            data += d
        })

        res.on('end', function() {
        
        data = JSON.parse(data)

        var order = "Large cheese pizza".split(" ")
 
 for (var i = 0 ;i < data.menu.length ;i++) {
    if(data.menu[i].name.toLowerCase().includes(order[order.length-1].toLowerCase())){
        for (var j = 0 ;j < data.menu[i].children.length;j++) {
            if(data.menu[i].children[j].name.toLowerCase().includes("Large cheese".toLowerCase())){
                item = data.menu[i].children[j]
                break
            }

     /*   for (var k = 0 ;k < data.menu[i].children[j].children.length ;k++) {

            if(data.menu[i].children[j].children[k].name.toLowerCase().includes("large cheese".toLowerCase())) {
                item = data.menu[i].children[j].children[k]
                break
            }
        }*/
        
        
    }
 } // end of for loop
}
  sendTextMessage(sender, "The " + item.name + "is $" + item.price)
})
    })
}

    

function confirm(sender, item){

  let messageData= {"attachment":
  {
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Would you like to add " + item.name + " to cart",
        "buttons":[
          {
            "type":"postback",
            "title":"Yes",
            "payload":"Add_to_cart"
          },
          {
            "type":"postback",
            "title":"NO",
            "payload":"Dont Add"
          }],
      
    }
}}
   request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
        }


function getLocalMerchantList(sender) {
http.get({host:'sandbox.delivery.com', path: '/merchant/search/delivery?address=56%20Plum%20Street,%2008901&client_id=NWFlOThkMjQ3MDZiOTMxMzc2NTAyMzg1OGE3MjJkN2Fm&client_secret=r5BaqHvRH5AP8vhmkV9TrxjMUnpiKX7pB9lB9g6y', headers: {'Content-Type': 'application/json'}}, function(res) {
        //var response = JSON.parse(res.data)
        var data = ""
        res.on('data', function(d) {
            data += d
        })

        res.on('end', function() {
        
            data = JSON.parse(data)
            debugger;
            //console.log(data.merchants[0].summary.name)
          let messageData = {
            "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": data.merchants[0].summary.name,
                    "subtitle": data.merchants[0].summary.description,
                    "image_url": data.merchants[0].summary.merchant_logo,
                    "buttons": [{
                        "type": "web_url",
                        "url": data.merchants[0].summary.url.complete,
                        "title": "Menu"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": data.merchants[0].id,
                    }],
                }, {
                   "title": data.merchants[1].summary.name,
                    "subtitle": data.merchants[1].summary.description,
                    "image_url": data.merchants[1].summary.merchant_logo,
                    "buttons": [{
                        "type": "web_url",
                        "url": data.merchants[1].summary.url.complete,
                        "title": "Menu"
                    }, {
                        "type": "postback",
                        "title": "Order from Here",
                        "payload": data.merchants[1].id,
                    }],
                    },
                    {
                     "title": data.merchants[2].summary.name,
                    
                    "subtitle": data.merchants[2].summary.description,
                    "image_url": data.merchants[2].summary.merchant_logo,
                    "buttons": [{
                        "type": "web_url",
                        "url": data.merchants[2].summary.url.complete,
                        "title": "Menu"
                    }, {
                        "type": "postback",
                        "title": "Order from Here",
                        "payload": data.merchants[2].id,
                    }],
                },

                {
                     "title": data.merchants[3].summary.name,
                    
                    "subtitle": data.merchants[3].summary.description,
                    "image_url": data.merchants[3].summary.merchant_logo,
                    "buttons": [{
                        "type": "web_url",
                        "url": data.merchants[3].summary.url.complete,
                        "title": "Menu"
                    }, {
                        "type": "postback",
                        "title": "Order from Here",
                        "payload": data.merchants[3].id,
                    }]
                },
                {
                     "title": data.merchants[4].summary.name,
                    
                    "subtitle": data.merchants[4].summary.description,
                    "image_url": data.merchants[4].summary.merchant_logo,
                    "buttons": [{
                        "type": "web_url",
                        "url": data.merchants[4].summary.url.complete,
                        "title": "Menu"
                    }, {
                        "type": "postback",
                        "title": "Order from Here",
                        "payload": data.merchants[1].id,
                    }],
                }
                    ]
            }
        }
    }
    

    
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
    
   
})

   app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

      
