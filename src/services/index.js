const { TagRepository } = require('../database')
const mongoose = require('mongoose')

class TagService {

    constructor() {
        this.repository = new TagRepository()
    }

}

module.exports = TagService