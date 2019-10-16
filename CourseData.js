const Fs = require('fs').promises;
const fs = require('fs');

class courseData {
    constructor(nick_name) {
        var realData = JSON.parse(fs.readFileSync(__dirname + `/database/courses/${nick_name}.json`));
        this.data = realData;
        this.nick_name = nick_name;
    }
    getData(){
        var realData = JSON.parse(fs.readFileSync(__dirname + `/database/courses/${this.nick_name}.json`));
        this.data = realData;
        return this.data;
    }
    // code is a 2-element array
    getLecture(code) {
        if(code.length !== 2)
            return null;
        let name = this.data.lecture[parseInt(code[0])].name;
        let lecture = this.data.lecture[parseInt(code[0])][name][parseInt(code[1])];
        return lecture;
    }
    getLectureName(code) {
        if(code.length !== 2)
            return null;
        let name = this.data.lecture[parseInt(code[0])].name;
        return name;
    }
    updateData(user_id, lecture_code) {
        var path = __dirname + `/database/courses/${this.nick_name}.json`;
        createDir(path);
        
        let data = this.getData();
        let code = lecture_code.split(",");
        
        if(code.length !== 2)
            return null;

        let name = this.data.lecture[parseInt(code[0])].name;
        for(let i = 0; i < this.data.lecture[parseInt(code[0])][name][parseInt(code[1])]["note"].length; i++) {
            if(this.data.lecture[parseInt(code[0])][name][parseInt(code[1])]["note"][i].user_id == user_id)
                return false;
        }
        this.data.lecture[parseInt(code[0])][name][parseInt(code[1])]["note"].push({
            user_id: user_id,
            thumbsup: 0,
            thumbsup_person: {
            }
        });
        console.log("Going to upload data: ", JSON.stringify(this.data));
        
        fs.writeFile(path, JSON.stringify(this.data), function(err) {
            if(err) {
                console.error(err);
                return 'error';
            }
            return 'success';
        });
    }
}

async function ensureDir(dirpath) {
    try {
        await Fs.mkdir(dirpath, {recursive: true});
    }
    catch(err) {
        if(err.code !== 'EEXIST') throw err;
    }
}

async function createDir(dirpath) {
    try {
        await ensureDir(dirpath);
        console.log(`Directory ${dirpath} created`);
    } catch(err) {
        console.error(err);
    }
}

module.exports = courseData;