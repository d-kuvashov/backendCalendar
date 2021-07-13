const { MongoClient } = require('mongodb');
let express = require('express');
let router = express();

//Generating code for the meeting
function codeGenerator() {
    let symbols = "abcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 10; i++) {
        code += symbols[Math.floor(Math.random() * 33)];
    }
    return code;
}

//Main function
async function main(codeForMeeting, creatorName, aimOfMeeting) {
    const uri = "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    let arrayForDays = [42];
    for (let i = 0; i < 42; i++) {
        arrayForDays[i] = '2';
    }
    try {
        await client.connect();
        await createListing(client, {
            aim: aimOfMeeting,
            name: creatorName,
            code: codeForMeeting,
            day: arrayForDays,
        });
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

//Adding new meeting to the DB
async function createListing(client, newListing) {
    await client.db("myFirstDatabase").collection("meeting").insertOne(newListing);
}

router.post("/", (req, res) => {
    //console.log("yep");
    let creatorName = req.body.creatorName;
    let aimOfMeeting = req.body.aimOfMeeting;
    let codeForMeeting = codeGenerator();
    async function callingMain() {
        try {
            await main(codeForMeeting, creatorName, aimOfMeeting);
        } catch(e) {
            console.error(e);
        }
    }
    callingMain();
    res.send(codeForMeeting);
});

module.exports = router;


////"mongodb+srv://adminUser:uChdi6S_b4eaDjshab1!@cluster0.id4nv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";