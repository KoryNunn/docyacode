/**
    # docyacode #

    ## In-code usage ##

    start a code block with two astrixes:

        /**

        stuff

        things

    end it as usual.

    ## Comment syntax ##

    docyacode uses [marked](https://github.com/chjj/marked) with [Github flavored markdown](https://help.github.com/articles/github-flavored-markdown)

    ## Usage ##

        node docyacode.js docyacode.js > doc.html

*/

var marked = require('marked'),
    fs = require('fs'),
    clientStyles = fs.readFileSync(__dirname + '/docStyle.css'),
    clientScript = fs.readFileSync(__dirname + '/clientscript.js'),
    commentRegex = /\/\*\*[\s\S]*?\*\//gm;

marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-'
});

module.exports = function(file, returnAsMarkdown){
    var comments = file.match(commentRegex),
        result = '';

    if(!comments){
        return '<h1>This file has no docyacode comments</h1>';
    }

    comments.forEach(function(comment){
        var indentation = 100,
            lines = comment.split(/[\n|\r]/),
            markdownLines = [];

        lines.slice(1,-1).forEach(function(line){
            if(!line.trim()){
                return;
            }

            var startWhitespace = line.match(/^\s*/);

            if(startWhitespace){
                indentation = Math.min(startWhitespace.pop().length, indentation);
            }else{
                indentation = 0;
            }
        });

        lines.slice(1,-1).forEach(function(line){
            markdownLines.push(line.slice(indentation));
        });

        result += markdownLines.join('\n');
    });

    if(!returnAsMarkdown){
        result = marked(result);
        result = '<style>' + clientStyles + '</style>' + result;
        result = '<script>' + clientScript + '</script>' + result;
    }

    return result;
}