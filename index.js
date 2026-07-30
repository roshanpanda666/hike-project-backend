const express=require("express")
const connectdb=require("./connection")
const hikerouter=require("./routes/hike")
const userrouter=require("./routes/user")
const app=express()
const port=4000

app.use(express.json())

//connection

connectdb().then(()=>{
    console.log("connected to the database")
}).catch((err)=>{
    console.log(err)
})


app.use("/api/hike",hikerouter)
app.use("/api/user",userrouter)


app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})