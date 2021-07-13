const { MongoClient } = require('mongodb');
let express = require('express');
let router = express();

//Main function
async function main(userName, codeOfMeeting, day) {
    const uri = "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    let array = [42];
    day.forEach((state,i) => {
        switch (state) {
        case ("#E26159"): array[i] = '1'; break;
        case ("grey"): array[i] = '2'; break;
        case ("#6DD176"): array[i] = '3'; break;
        default: array[i] = ''; break;
    }
    })
    //console.log(array);
    try {
        await client.connect();

        const cursor = client.db("myFirstDatabase").collection("meeting").find(
            {
                code: { $eq: codeOfMeeting },
                name: { $eq: userName},
            }
        );
        const results = await cursor.toArray();

        let userDays;

        if (results.length > 0) {
            results.forEach((result, i) => {
                userDays = result.day;
            });
        }
        userDays.forEach((rows,i) => {
            if (array[i] !== '') 
                if (rows !== array[i])
                    userDays[i]=array[i];
        })
        let updatedListing = { day: userDays };
        await client.db("myFirstDatabase").collection("meeting").updateOne(
            {
                name: userName,
                code: codeOfMeeting
            },
            { $set: updatedListing }
        );
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

router.post("/", (req, res) => {
     async function sendFreeDays() {
         try {
             const userName = req.body.userName;
             const codeOfMeeting = req.body.codeOfMeeting;
             const day = req.body.day;
             //console.log(day);
             main(userName, codeOfMeeting, day);
        } catch (e) {
            console.error(e);
        }
    }
    sendFreeDays();
});

module.exports = router;


////"mongodb+srv://adminUser:uChdi6S_b4eaDjshab1!@cluster0.id4nv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";