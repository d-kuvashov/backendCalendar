const { MongoClient } = require('mongodb');
let express = require('express');
let router = express();


//Main function
async function main(codeOfMeeting, userName) {
    const uri = "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const cursor = client.db("myFirstDatabase").collection("meeting").find(
            {
                code: { $eq: codeOfMeeting },
                name: { $eq: userName },
            }
        );
        const results = await cursor.toArray();

        let userBusyDays;
        if (results.length > 0) {
            //console.log(`Found meeting  with this ${codeOfMeeting} code`);
            results.forEach((result, i) => {
                userBusyDays = result.day;
            });
            return userBusyDays;
        } else {
            //console.log("wtf is this code?");
        }
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}


router.post("/", (req, res) => {
    const code = req.body.code;
    const name = req.body.name;
    //console.log(req.body);
    async function sendBusyDays() {
        try {
            //console.log("i'm trying");
            const result = await main(code,name);
            res.send(result);
        } catch(e) {
            console.error(e);
        }
    }
    sendBusyDays();
});

module.exports = router;


////"mongodb+srv://adminUser:uChdi6S_b4eaDjshab1!@cluster0.id4nv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";