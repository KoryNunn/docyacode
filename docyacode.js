var file = process.argv[2],
    marked = require('marked'),
    fs = require('fs'),
    commentRegex = /\/\*\*[\s\S]*?\*\//gm;


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

fs.readFile(file, function(error, file){
    var file = file.toString(),
        comments = file.match(commentRegex),
        result = '<link rel="stylesheet" href="docStyle.css">';


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


        result += marked(markdownLines.join('\n'));
    })

    console.log(result);

});

