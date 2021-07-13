const { MongoClient } = require('mongodb');
let express = require('express');
let router = express();


//Main function
async function main(codeOfMeeting) {
    const uri = "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    let arrayForDays = [42];
    for (let i = 0; i < 42; i++) {
        arrayForDays[i] = '1';
    }
    try {
        await client.connect();
        const cursor = client.db("myFirstDatabase").collection("meeting").find(
            {
                code: { $eq: codeOfMeeting }
            }
        );
        const results = await cursor.toArray();

        let userName = [results.length];
        let userFreeDays = [results.lentgh];
        let countFree = 0;
        let countAmbivalent = 0;
        let countBusy = 0;
        let finalFreeDaysArray = [42];

        if (results.length > 0) {
            //console.log(`Found meeting  with this ${codeOfMeeting} code`);
            results.forEach((result, i) => {
                userName[i] = result.name;
                userFreeDays[i] = result.day;
            });
            for (let j = 0; j < 42; j++) {
            for (let i = 0; i < results.length; i++)
                switch (userFreeDays[i][j]) {
                    case ('1'): countFree++; break;
                    case ('2'): countAmbivalent++; break;
                    case ('3'): countBusy++; break;
                }

            if (countBusy > countFree && countBusy > countAmbivalent)
                finalFreeDaysArray[j] = '3';
            else if (countFree > countBusy && countFree > countAmbivalent)
                finalFreeDaysArray[j] = '1';
            else finalFreeDaysArray[j] = '2';

            countFree = countBusy = countAmbivalent = 0;
        }
        return finalFreeDaysArray;
        } else {
            //console.log(`No meeting found with this ${codeOfMeeting} code`);
            return "Error. There is no meeting with such code";
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
    const code = req.body.codeOfMeeting;
    async function sendFreeDays() {
        try {
            const result = await main(code);
            res.send(result);
        } catch(e) {
            console.error(e);
        }
    }
    sendFreeDays();
});

module.exports = router;


////"mongodb+srv://adminUser:uChdi6S_b4eaDjshab1!@cluster0.id4nv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";