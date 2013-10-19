/**
    # docyacode #

    ## In-code usage ##

    start a code block with two astrixes:

        /**

    end it as usual.

    ## Comment syntax ##

    docyacode uses [marked](https://github.com/chjj/marked) with [Github flavored markdown](https://help.github.com/articles/github-flavored-markdown)

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

/**
    ## docyacode(file, returnAsMarkdown) ##

    Takes a file, scans it for docyacode comments, and returns HTML or markdown.

        docyacode(myFile); // returns html docs.
*/

function renderMD(doc){
    var result = '';

    doc.subBlocks.forEach(function(block){
        result+=block.md;
        if(block.subBlocks.length){
            result+=renderMD(block);
        }
    });

    return result;
}

function renderHTML(doc, isSub){
    var result = '';

    if(!isSub){
        result += '<style>' + clientStyles + '</style>';
        result += '<script>' + clientScript + '</script>';
    }

    doc.subBlocks.forEach(function(block){
        result+='<div class="docyacode-block" data-blockname="' + block.heading + '">';
        result+=marked(block.md);
        if(block.subBlocks.length){
            result+='<section>';
            result+=renderHTML(block, true);
            result+='</section>';
        }
        result+='</div>';
    });

    return result;
}

module.exports = function(file, returnAsMarkdown){
    var comments = file.match(commentRegex),
        doc = {
            indentation:0,
            subBlocks:[]
        };

    if(!comments){
        return '<h1>This file has no docyacode comments</h1>';
    }

    var parentBlock = doc;

    comments.forEach(function(comment){
        var indentation = 100,
            lines = comment.split(/[\n|\r]/),
            markdownLines = [];


        lines.slice(1,-1).forEach(function(line){
            if(!line.trim()){
                return;
            }

            var startWhitespace = line.match(/^\s*/);

            if(startWhitespace.length){
                indentation = Math.min(startWhitespace.pop().length, indentation);
            }
        });

        lines.slice(1,-1).forEach(function(line){
            markdownLines.push(line.slice(indentation));
        });

        var block = {
            md: markdownLines.join('\n'),
            subBlocks: [],
            indentation: indentation
        };

        block.heading = /^\s*?#+(.*?)$/gm.exec(block.md)[1];

        while(parentBlock.indentation >= block.indentation){
            parentBlock = parentBlock.parent || doc;
        }
        parentBlock.subBlocks.push(block);
        block.parent = parentBlock;

        parentBlock = block;
    });

    if(returnAsMarkdown){
        return renderMD(doc);
    }

    return renderHTML(doc);
}