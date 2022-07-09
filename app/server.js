const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const createError = require("http-errors")
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require("cors")
const { AllRoutes } = require('./router/router');



module.exports = class Application {
    #app = express();
    #DB_URI;
    #PORT;
    constructor(PORT,DB_URI){
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;
        this.configApplication();
        this.connectToMongoDb();
        this.createServer();
        this.createRoutes();
        this.errorHandling(); 
    }

    configApplication(){
        this.#app.use(cors())
        // this.#app.use(morgan("dev"));
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended:true}));
        this.#app.use(express.static(path.join(__dirname,'..','public')));
        this.#app.use("/api-doc", swaggerUI.serve,swaggerUI.setup(swaggerJSDoc({
            swaggerDefinition : {
                info : {
                    title: "DIvar Stor",
                    version :"2.0",
                    description:"This is Description",
                    contact : {
                        name:"AliReza",
                        url:"",
                        email:"Alirezadelbari20@yahoo.com"
                    }
                }
            },
            servers : [ {
                url : "http://localhost:4000"
            }],
            apis : ["./app/router/**/*.js"]
        })))

    }

    createServer(){
        const http = require('http');
        http.createServer(this.#app).listen(this.#PORT, () => {
            console.log("run > http://localhost:"+this.#PORT)
        })
    }

    connectToMongoDb(){
        mongoose.connect(this.#DB_URI, (error) => {
            if(!error) return console.log('Connect to Mongodb');
            return console.log(error.message)
        })

        // mongoose.connection.on("connected" , () => {
        //     console.log("mongos Connected to db")
        // })

        // mongoose.connection.on("disconnected" , () => {
        //     console.log("mongos Connected to db")
        // })

        process.on("SIGINT" ,async () => {
           await mongoose.connection.close;
           process.exit(0)
        })
    }

    createRoutes(){
      this.#app.use(AllRoutes)
    }

    errorHandling(){
        this.#app.use((req,res,next) => {
            next(createError.NotFound('آدرس مورد نظر یافت نشد'));
        })

        this.#app.use((error,req,res,next) => {
            const serverError = createError.InternalServerError();
            const statusCode = error.status || serverError.status;
            const message = error.message || serverError.message;
            return res.status(200).json({
                errors : {
                    statusCode,
                    message
                }
            })
        })
    }


}