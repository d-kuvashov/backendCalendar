const { MongoClient } = require('mongodb');
let express = require('express');
let router = express();
//let router = express.Router();

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
async function main(whatToDo) {
    const uri = "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    let arrayForDays = [42];
    for (let i = 0; i < 42; i++) {
        arrayForDays[i] = '1';
    }
    try {
        await client.connect();
        switch (whatToDo) {
            case ('0'): await createNewMeeting(client); break;
            case ('1'): await catchFreeDays(client, { codeOfMeeting: "2tsj0vuoyj" }); break;
            case ('2'): await authorization(client, { userName: "Name1", codeOfMeeting: "2tsj0vuoyj" }); break;
            case ('3'): await updateFreeDays(client, { userName: "Name8 ", codeOfMeeting: "2tsj0vuoyj" }, { day: arrayForDays }); break;
        }
    }
    catch(e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

//Creating new Meeting
async function createNewMeeting(client) {
    let arrayForDays = [42];
    let creatorName;
    let codeForMeeting = codeGenerator();
    for (let i = 0; i < 42; i++) {
        arrayForDays[i] = '3';
    }
    createListing(client, {
        name: creatorName,
        code: codeForMeeting,
        day: arrayForDays
    });
}

//Adding new meeting to the DB
async function createListing(client, newListing) {
    await client.db("myFirstDatabase").collection("meeting").insertOne(newListing);
}

//Function that is showing which day can be used as a meeting day
async function catchFreeDays(client, { codeOfMeeting = "" } = {}) {
    const cursor = client.db("myFirstDatabase").collection("meeting").find(
        {
            code: { $eq : codeOfMeeting }
        }
    );
    const results = await cursor.toArray();

    let userName = [results.length];
    let userFreeDays = [results.lentgh];

    if (results.length > 0) {
        console.log(`Found meeting  with this ${codeOfMeeting} code`);
        results.forEach((result, i) => {
            userName[i] = result.name;
            userFreeDays[i] = result.day;
        });
    } else {
        console.log(`No meeting found with this ${codeOfMeeting} code`);
    }

    let countFree = 0;
    let countAmbivalent = 0;
    let countBusy = 0;
    let finalFreeDaysArray = [42];

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
    console.log(finalFreeDaysArray);
}

//Authorization in an exisiting meeting
async function authorization(client, { userName = "", codeOfMeeting = "" } = {}) {
    let arrayForDays = [42];
    for (let i = 0; i < 42; i++) {
        arrayForDays[i] = '3';
    }

    const cursor = client.db("myFirstDatabase").collection("meeting").find(
        {
            code: { $eq: codeOfMeeting }
        }
    );
    const results = await cursor.toArray();
    
    if (results.length === 0) {
        console.log("Error! Check the code");
    } else {
        const cursor2 = client.db("myFirstDatabase").collection("meeting").find(
            {
                name: { $eq: userName },
                code: { $eq: codeOfMeeting }
            }
        );
        const results2 = await cursor2.toArray();
        if (results2.length === 0)
            createListing(client, {
                name: userName,
                code: codeOfMeeting,
                day: arrayForDays
            });
    } 
}

//Updating information
async function updateFreeDays(client, { userName = "", codeOfMeeting = "" } = {}, updatedListing) {
    await client.db("myFirstDatabase").collection("meeting").updateOne(
        {
            name: userName,
            code: codeOfMeeting
        },
        { $set: updatedListing}
    );
}


router.post("/", (req, res) => {
    
    console.log(req.body.num);
});

module.exports = router;


////"mongodb+srv://adminUser:uChdi6S_b4eaDjshab1!@cluster0.id4nv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// "mongodb+srv://demo:12345@cluster0.8p3hn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";