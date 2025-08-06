var md2conflu = require('./')
var assert = require('assert')

var pairs = [
    // Basic heading tests
      ['# h1', 'h1. h1\n\n']
    , ['head1\n===', 'h1. head1\n\n']
    , ['###  h3', 'h3. h3\n\n']
    
    // Additional heading tests for edge cases
    , ['## h2', 'h2. h2\n\n']
    , ['head2\n---', 'h2. head2\n\n']
    , ['#### h4', 'h4. h4\n\n']
    , ['##### h5', 'h5. h5\n\n']
    , ['###### h6', 'h6. h6\n\n']
    
    // Test heading with extra spaces
    , ['#    h1 with spaces   ', 'h1. h1 with spaces\n\n']
    
    // Code block tests with new language support
    , ['```javascript\nconsole.log("hello");\n```', '{code:language=javascript|linenumbers=true|theme=Confluence}\nconsole.log("hello");\n{code}\n\n']
    , ['```python\nprint("hello")\n```', '{code:language=python|linenumbers=true|theme=Confluence}\nprint("hello")\n{code}\n\n']
    , ['```go\nfmt.Println("hello")\n```', '{code:language=go|linenumbers=true|theme=Confluence}\nfmt.Println("hello")\n{code}\n\n']
    , ['```\nno language\n```', '{code:language=none|linenumbers=true}\nno language\n{code}\n\n']
    
    // Single line code (no line numbers)
    , ['```js\nconsole.log("test")\n```', '{code:language=javascript|linenumbers=true|theme=Confluence}\nconsole.log("test")\n{code}\n\n']
    
    // Block quote test with improved formatting
    , ['> This is a quote', '{quote}This is a quote{quote}\n\n']
    
    // Horizontal rule test
    , ['---', '----\n\n']
    , ['---\n\n## Next Section', '----\n\nh2. Next Section\n\n']
]

pairs.forEach(function(arr, i) {
    try {
        assert.equal(md2conflu(arr[0]), arr[1], i + ': ' + arr[0] + ' should equal ' + arr[1])
        console.log('✓ Test ' + (i + 1) + ' passed: ' + arr[0].replace(/\n/g, '\\n'))
    } catch (e) {
        console.log('✗ Test ' + (i + 1) + ' failed: ' + arr[0].replace(/\n/g, '\\n'))
        console.log('  Expected: ' + JSON.stringify(arr[1]))
        console.log('  Actual:   ' + JSON.stringify(md2conflu(arr[0])))
        throw e
    }
})

console.log('\nAll ' + pairs.length + ' tests passed! ✓')
