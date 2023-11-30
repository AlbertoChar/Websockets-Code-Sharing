const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
    code_block_num: {
        type: Number,
        required: true,
        unique: true
    },
    code_block_title: String,
    content: String,
});

const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema);
module.exports = CodeBlock;
