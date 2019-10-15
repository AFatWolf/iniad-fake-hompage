const Fs = require('fs').promises;
const fs = require('fs');

class userData {
    constructor(student_id, password) {
        this.student_id = student_id;
        let key = 123456789;
        this.password = password;
        createDir(__dirname + `/database/users/${student_id}`); 
    }
    getName() {
        return this.student_id;
    }
    getId() {
        return this.student_id;
    }
    saveNote(notetext, nick_name, lecture_id) {
        let path = __dirname + `/database/users/${this.student_id}/${nick_name}/${lecture_id}`;
        createDir(path);
        fs.writeFile(path + "/note.txt", notetext, function(err) {
            if(err) {
                console.error(err);
                return 'error';
            }
            return 'success';
        });
    }
    getNote(nick_name, lecture_id){
        let path = __dirname + `/database/users/${this.student_id}/${nick_name}/${lecture_id}`;
        createDir(path);
        var notetext;
        try {
            notetext = fs.readFileSync(path + "/note.txt", "utf-8");
        } catch(err) {
            fs.writeFile(path + "/note.txt", "", function(err) {
                if(err) {
                    console.error(err);
                    return 'error';
                }
                return 'success';
            });
            notetext = "";
        }
        return notetext;
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

module.exports = userData;