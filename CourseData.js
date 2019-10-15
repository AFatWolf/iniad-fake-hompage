const fs = require('fs')

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
}

module.exports = courseData;