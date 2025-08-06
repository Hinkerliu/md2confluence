var marked = require('marked')
var _ = require('min-util')
var qs = require('min-qs')
var inlineLexer = marked.inlineLexer

module.exports = exports = markdown2confluence

// https://roundcorner.atlassian.net/secure/WikiRendererHelpAction.jspa?section=all
// https://confluence.atlassian.com/display/DOC/Confluence+Wiki+Markup
// http://blogs.atlassian.com/2011/11/why-we-removed-wiki-markup-editor-in-confluence-4/

var MAX_CODE_LINE = 20

function Renderer() {}

var rawRenderer = marked.Renderer

var langArr = 'actionscript3 bash csharp coldfusion cpp css delphi diff erlang groovy java javafx javascript perl php none powershell python ruby scala sql vb html xml typescript go rust swift kotlin dart yaml json'.split(/\s+/)
var langMap = {
	shell: 'bash',
	sh: 'bash',
	html: 'html',
	xml: 'xml',
	ts: 'typescript',
	js: 'javascript',
	py: 'python',
	rb: 'ruby',
	c: 'cpp',
	'c++': 'cpp',
	rs: 'rust',
	kt: 'kotlin',
	go: 'go',
	yml: 'yaml',
	json: 'json'
}
for (var i = 0, x; x = langArr[i++];) {
	langMap[x] = x
}

_.extend(Renderer.prototype, rawRenderer.prototype, {
	  paragraph: function(text) {
		return text + '\n\n'
	}
	, html: function(html) {
		return html
	}
	, heading: function(text, level, raw) {
		// Ensure level is within valid range for Confluence (1-6)
		level = Math.min(Math.max(parseInt(level) || 1, 1), 6)
		// Trim whitespace and ensure proper spacing
		text = text.trim()
		return 'h' + level + '. ' + text + '\n\n'
	}
	, strong: function(text) {
		return '*' + text + '*'
	}
	, em: function(text) {
		return '_' + text + '_'
	}
	, del: function(text) {
		return '-' + text + '-'
	}
	, codespan: function(text) {
		return '{{' + text + '}}'
	}
	, blockquote: function(quote) {
		// Trim extra whitespace for better Confluence rendering
		quote = quote.trim()
		return '{quote}' + quote + '{quote}\n\n'
	}
	, br: function() {
		return '\n'
	}
	, hr: function() {
		// 确保水平线后面有足够的换行符，避免与后续内容连接
		return '----\n\n'
	}
	, link: function(href, title, text) {
		var arr = [href]
		if (text) {
			arr.unshift(text)
		}
		return '[' + arr.join('|') + ']'
	}
	, list: function(body, ordered) {
		var arr = _.filter(_.trim(body).split('\n'), function(line) {
			return line
		})
		var type = ordered ? '#' : '*'
		return _.map(arr, function(line) {
			return type + ' ' + line
		}).join('\n') + '\n\n'

	}
	, listitem: function(body, ordered) {
		return body + '\n'
	}
	, image: function(href, title, text) {
		return '!' + href + '!'
	}
	, table: function(header, body) {
		return header + body + '\n'
	}
	, tablerow: function(content, flags) {
		return content + '\n'
	}
	, tablecell: function(content, flags) {
		var type = flags.header ? '||' : '|'
		return type + content
	}
	, code: function(code, lang) {
		// {code:language=java|borderStyle=solid|theme=RDark|linenumbers=true|collapse=true}
		if(lang) {
			lang = lang.toLowerCase()
		}
		lang = langMap[lang] || 'none'
		var param = {
			language: lang
		}
		
		var lineCount = _.split(code, '\n').length
		
		// Add line numbers for code blocks (always for multi-line, optional for single line)
		param.linenumbers = true
		
		// Add collapse for long code blocks
		if (lineCount > MAX_CODE_LINE) {
			param.collapse = true
		}
		
		// Use modern theme that works well in Confluence 9.2.4
		if (lang !== 'none') {
			param.theme = 'Confluence'
		}
		
		param = qs.stringify(param, '|', '=')
		return '{code:' + param + '}\n' + code + '\n{code}\n\n'
	}
})

var renderer = new Renderer()

function markdown2confluence(markdown) {
	var result = marked(markdown, {renderer: renderer})
	
	// 后处理：确保水平线和标题之间有正确的分隔
	result = result.replace(/----([^\n])/g, '----\n$1')
	
	return result
}
