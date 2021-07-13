const { MongoClient } = require('mongodb');
let express = require('express');
let router = express();

//Main function
async function main(codeOfMeeting, userName) {
    const uri = "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        let arrayForDays = [42];
        for (let i = 0; i < 42; i++) {
            arrayForDays[i] = '2';
        }

        const cursor = client.db("myFirstDatabase").collection("meeting").find(
            {
                code: { $eq: codeOfMeeting }
            }
        );

        const codeCheck = await cursor.toArray();

        if (codeCheck.length === 0) {
            return "Error! Check the code";
        } else {
            const secondCursor = client.db("myFirstDatabase").collection("meeting").find(
                {
                    name: { $eq: userName },
                    code: { $eq: codeOfMeeting }
                }
            );
            const results = await secondCursor.toArray();
            if (results.length === 0)
                await client.db("myFirstDatabase").collection("meeting").insertOne({
                    aim: codeCheck[0].aim,
                    name: userName,
                    code: codeOfMeeting,
                    day: arrayForDays,
                });
            return codeCheck[0].aim;
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        client.close();
    }
};


router.post("/", (req, res) => {
    async function trying() {
        try {
            let userName = req.body.userName;
            let codeOfMeeting = req.body.codeOfMeeting;
            const result = await main(codeOfMeeting, userName);
            res.send(result);
        } catch(e) {
            console.error(e);
        }
    }
    trying();
})

module.exports = router;


////"mongodb+srv://adminUser:uChdi6S_b4eaDjshab1!@cluster0.id4nv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";