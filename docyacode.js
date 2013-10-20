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
    includeRegex = /\/\/\/\[(.*?)\]/gm,
    commentRegex = /\/\*\*(?!\*)[\s\S]*?\*\//gm;

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

function renderMenu(doc, isSub){
    var result = isSub ? '' : '<div class="menu">';

    doc.subBlocks.forEach(function(block){

        if(!block.heading){
            return;
        }

        result += '<a href="#' + block.heading + '">' + block.heading + '</a>';

        if(block.subBlocks.length){
            result+='<div>';
            result += renderMenu(block, true);
            result+='</div>';
        }
    });

    if(!isSub){
        result += '</div>';
    }

    return result;
}

function renderHTML(doc, isSub){
    var result = '';

    if(!isSub){
        result += '<style>' + clientStyles + '</style>';
        result += '<script>' + clientScript + '</script>';

        result += renderMenu(doc);
    }

    doc.subBlocks.forEach(function(block){
        result += '<div class="docyacode-block" data-blockname="' + block.heading + '">';
        block.heading && (result += '<a name="' + block.heading + '"></a>');
        result += marked(block.md);

        if(block.subBlocks.length){
            result+='<section>';
            result += renderHTML(block, true);
            result+='</section>';
        }

        result +='</div>';
    });

    return result;
}

module.exports = function(file, returnAsMarkdown){

    file = file.replace(includeRegex, function(match, item){
        return '/**\n' + fs.readFileSync(item).toString() + '\n*/';
    });

    var comments = file.match(commentRegex),
        doc = {
            indentation:-1,
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

        var heading = /^\s*?#+\s*(.*?)$/gm.exec(block.md);

        block.heading = heading && heading[1];

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