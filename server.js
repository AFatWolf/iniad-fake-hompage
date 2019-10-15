const PORT = process.env.PORT || 8000;
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const courseData = require("./CourseData.js");
const userData = require('./UserData.js');
const cookieParser = require('cookie-parser');
const fs = require("fs");
app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('resources'));
app.use(express.static('imgs'));
app.use(express.static('css'));
app.use(express.static('database/courses'));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, 'views'));
app.use(cookieParser());

var database = databaseInit();
var course_database = {}

function databaseInit() {
    let base = {}
    var data = fs.readFileSync(__dirname + `/database/users/users.json`);
    data = JSON.parse(data);
    for(let key in data) {
        if(data.hasOwnProperty(key)) {
            base[key] = new userData(key, data[key].password);
        }
    }
    return base;
}

app.get('/', (req, res) => {
    console.log(req.cookies);
    if((req.cookies === undefined) || !("session_id" in req.cookies))
        res.render('login.pug');
    else
        res.redirect('/menu');
});

app.get('/logout', (req, res) => {
    res.clearCookie("session_id");
    res.render('login.pug');
})

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log('User: ' + req.body.username);
    console.log('Password: ' + req.body.password);
    if(username in database) {
        if(database[username].password === password) {
            res.cookie("session_id", {
                user_id: req.body.username
            });
            res.redirect('/menu');
        }
    }
    else {
        res.render("fail-login.pug");
    }
    
});

app.get('/menu', (req, res) => {
    console.log(req.cookies);
    let user_id = req.cookies.session_id.user_id;
    console.log("User id:" , user_id);
    let user = database[user_id];
    console.log(user);
    res.render("menu.pug", {
        "student_name": user.student_id,
        "account": user.student_id,
        "user_id": user.student_id,
        "courses_name": [
            {
                "name": "Introduction to Engineer",
                "nick_name": "ITIE1",
            },
            {
                "name": "Introduction to Computer Science and Exercise 1",
                "nick_name": "ITCSEI"
            },
            {
                "name": "Introduction to Computer and Society",
                "nick_name": "ITCS"
            },
            {
                "name": "Computer Architecture",
                "nick_name": "CA"
            }
        ]
    });
})



app.get('/courses', (req, res) => {
    console.log(`${req.query}`);
    console.log(`The name: ${req.query.user_id}`);
    let user = database[req.query.user_id]
    res.render('livestream.pug', {
        student_name: user.getName(),
        nick_name: user.getId(),
        user_id: user.getId(),
        video_link:"https://www.youtube.com/embed/4a0FbQdH3dY"
    })
});

app.get('/courses/livestream', (req, res) => {
    console.log("yay");
    let user = database[req.query.user_id];
    let course_data;
    if(!(req.query.nick_name in course_database)){
        course_data = new courseData(req.query.nick_name);
        course_database[req.query.nick_name] = course_data;
        console.log("Data another is: ", JSON.stringify(course_data.getData()));
    }
    else {
        course_data = course_database[req.query.nick_name];
    }
    // if this is not choosing the lecture in sidebar
    if(("lecture_code" in req.query)) {
        let code = req.query.lecture_code.split(",");
        console.log("------Code is: " ,code);
        let lecture = course_database[req.query.nick_name].getLecture(code);
        let lecture_name = course_database[req.query.nick_name].getLectureName(code);
        res.render('livestream.pug', {
            student_name: user.getName(),
            account: req.query.user_id,
            nick_name:req.query.nick_name,
            user_id: user.getId(),
            course: course_data.getData(),
            course_data: JSON.stringify(course_data.getData()),
            video_link: lecture.video_link,
            lecture: lecture,
            lecture_code: req.query.lecture_code,
            lecture_name: lecture_name,
            notetext: user.getNote(req.query.nick_name, req.query.lecture_code)
        });
    }
    else {
        let lecture = course_database[req.query.nick_name].getLecture(["0", "0"]);
        let lecture_name = course_database[req.query.nick_name].getLectureName(["0", "0"]);
        res.render('livestream.pug', {
            student_name: user.getName(),
            account: req.query.user_id,
            nick_name: req.query.nick_name,
            user_id: user.getId(),
            course: course_data.getData(),
            course_data: JSON.stringify(course_data.getData()),
            video_link:lecture.video_link,
            lecture: lecture,
            lecture_code: "0,0",
            lecture_name: lecture_name,
            notetext: user.getNote(req.query.nick_name, "0,0")
        });
    }

})

app.post('/course/livestream/savenote', (req, res)=> {
    console.log(req.body);
    let notetext = req.body["notetext"];
    let user_id = req.body.user_id;
    let nick_name = req.body.nick_name;
    let lecture_code = req.body.lecture_code;
    if(!(user_id in database)) {
        res.status(200).send("error");
    }
    else {
        console.log("Note received: ", notetext);
        let returnValue = database[user_id].saveNote(notetext, nick_name, lecture_code);
        if(returnValue === "error")
            res.status(200).send("error");
        else
            res.status(200).send(returnValue);
    }
});

app.post('/course/livestream/uploadnote', (req, res)=> {
    console.log(req.body);
    let notetext = req.body["notetext"];
    let user_id = req.body.user_id;
    let nick_name = req.body.nick_name;
    let lecture_code = req.body.lecture_code;
    if(!(user_id in database)) {
        res.status(200).send("error");
    }
    else {
        console.log("Note received: ", notetext);
        let returnValue = database[user_id].saveNote(notetext, nick_name, lecture_code);
        course_database[nick_name].updateData(user_id, lecture_code);
        if(returnValue === "error")
            res.status(200).send("error");
        else
            res.status(200).send(returnValue);
    }
});

app.get('/course/livestream/getnote', (req, res) => {
    console.log('hello its me livestream getnote');
    console.log(req.query);
    let user_id = req.query.user_id;
    let nick_name = req.query.nick_name;
    let lecture_code = req.query.lecture_code;
    if(!(user_id in database)) {
        res.status(400).send();
    }
    else {
        let returnValue = database[user_id].getNote(nick_name, lecture_code);
        var showdown  = require('showdown');
        let converter = new showdown.Converter({
            tables: true,
            strikethrough: true,
            simpleLineBreaks: true,
            emoji: true
        });
        let note_html = converter.makeHtml(returnValue);
        res.status(200).send(note_html);
        console.log("Return for getnote: ", converter.makeHtml("# I1"));
    }
});

app.post('/course/livestream/mdconvert', (req, res) => {
    let note = req.body.md;
    console.log("Translating: ", note);
    
    res.status(200).send(note_html);
})

app.listen(PORT, () => {
    console.log('Listening');
})

// you gonna need this someday: https://appdividend.com/2018/04/14/how-to-deploy-nodejs-app-to-heroku/#Step_3_Run_the_application_in_local
