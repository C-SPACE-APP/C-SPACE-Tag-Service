const mongoose = require('mongoose')

class DBUtils {

    constructor() {
        this.BLANK_PATTERN = /\S/g
    }

    async validID(id) {
        try { 
            const validID = mongoose.Types.ObjectId(id)
            return validID
        } catch(err) {
            return false
        }
    }

    async sanitize(obj) {
        for(const key in obj) {
            if(!obj[key]) {
                delete obj[key]
                continue
            }

            if(typeof obj[key] === 'string' && !obj[key].match(this.BLANK_PATTERN)) {
                delete obj[key]
                continue
            }
        }
        
        return obj
    }
    
}

module.exports = DBUtils