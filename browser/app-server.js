// Client-side JavaScript - Enhanced server version
$(document).ready(function() {
    // Demo markdown content
    var demoMarkdown = `# h1

head1
===

head2
---

### head3 ###

- **strong**
- *emphasis*
- ~~del~~
- \`code inline\`

> block quote

[github link address](https://github.com/chunpu/markdown2confluence)

\`\`\`javascript
var i = 1 // comment
console.log("This is code block")
\`\`\`

![image](https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)

## GFM support

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
*inline style* | **inline style**

:)`;

    // Initialize
    init();

    // Event handlers
    bindEvents();
    
    // Initialize drag and drop
    initializeDragDrop();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
    
    // Load saved session
    loadSession();

    function bindEvents() {
        // Convert button
        $('#convert').click(function() {
            var markdown = $('#markdown').val();
            convertMarkdown(markdown);
        });

        // Clear button
        $('#clear').click(function() {
            if (confirm('Are you sure you want to clear all content?')) {
                $('#markdown').val('');
                $('#markup').val('');
                clearSession();
                $('#markdown').focus();
                announceToScreenReader('Content cleared');
            }
        });

        // Copy button
        $('#copy').click(copyToClipboard);
        
        // Import button
        $('#import').click(function() {
            $('#file-input').click();
        });
        
        // Export button
        $('#export').click(exportToFile);
        
        // File input change
        $('#file-input').change(handleFileImport);

        // Real-time conversion
        $('#markdown').on('input', debounce(function() {
            if ($('#auto-convert').is(':checked')) {
                var markdown = $(this).val();
                if (markdown.trim()) {
                    convertMarkdown(markdown);
                }
            }
            // Save session automatically
            saveSession();
        }, 500));
        
        // Auto-convert toggle
        $('#auto-convert').change(function() {
            announceToScreenReader('Real-time conversion ' + (this.checked ? 'enabled' : 'disabled'));
        });
    }

    function init() {
        // Load demo content if no saved session
        if (!loadSession()) {
            $('#markdown').val(demoMarkdown);
            convertMarkdown(demoMarkdown);
        }
        
        // Set focus to markdown input
        $('#markdown').focus();
        
        // Update server info
        updateServerInfo();
    }
    
    function updateServerInfo() {
        var serverInfo = window.location.host || 'localhost:8092';
        $('#server-info').text(serverInfo);
    }

    function convertMarkdown(markdown) {
        if (!markdown.trim()) {
            $('#markup').val('');
            return;
        }

        // Show loading state
        $('#convert').prop('disabled', true).html('<i class="bi bi-arrow-repeat me-1 spin"></i>Converting...');
        $('#markup').val('Converting, please wait...');

        // Send API request
        $.ajax({
            url: '/api/convert',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ markdown: markdown }),
            success: function(response) {
                if (response.success) {
                    $('#markup').val(response.markup);
                    showMessage('Conversion successful!', 'success');
                    announceToScreenReader('Markdown converted successfully');
                } else {
                    $('#markup').val('Conversion failed: ' + response.error);
                    showMessage('Conversion failed: ' + response.error, 'error');
                }
            },
            error: function(xhr, status, error) {
                var errorMsg = 'Network error or server unavailable';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg = xhr.responseJSON.error;
                }
                $('#markup').val('Conversion failed: ' + errorMsg);
                showMessage('Conversion failed: ' + errorMsg, 'error');
            },
            complete: function() {
                $('#convert').prop('disabled', false).html('<i class="bi bi-arrow-repeat me-1"></i>Convert');
            }
        });
    }

    function showMessage(message, type, persistent) {
        var alertClass = 'alert alert-' + (type === 'error' ? 'danger' : type);
        var dismissible = persistent ? '' : 'alert-dismissible';
        var iconMap = {
            success: 'bi-check-circle',
            error: 'bi-x-circle',
            warning: 'bi-exclamation-triangle',
            info: 'bi-info-circle'
        };
        
        var alertHtml = '<div class="' + alertClass + ' ' + dismissible + ' fade show" role="alert">' +
                       '<div class="d-flex align-items-center">' +
                       '<i class="bi ' + (iconMap[type] || iconMap.info) + ' me-2"></i>' +
                       '<div>' + message + '</div>' +
                       (persistent ? '' : '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>') +
                       '</div>' +
                       '</div>';
        
        $('#messages').html(alertHtml);
        
        // Announce to screen readers
        announceToScreenReader(message);
        
        // Auto-dismiss if not persistent
        if (!persistent) {
            setTimeout(function() {
                $('#messages .alert').alert('close');
            }, 3000);
        }
    }

    // New functions for enhanced functionality
    function copyToClipboard() {
        var markup = $('#markup').val();
        var $button = $('#copy');
        var originalHtml = $button.html();
        
        if (markup.trim()) {
            // Disable button to prevent multiple clicks
            $button.prop('disabled', true);
            
            // Try modern Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(markup).then(function() {
                    showMessage('Successfully copied to clipboard!', 'success');
                    $button.html('<i class="bi bi-check me-1"></i>Copied').removeClass('btn-success').addClass('btn-outline-success');
                    announceToScreenReader('Content copied to clipboard');
                    
                    // Restore button after 2 seconds
                    setTimeout(function() {
                        $button.html(originalHtml).removeClass('btn-outline-success').addClass('btn-success').prop('disabled', false);
                    }, 2000);
                }).catch(function(err) {
                    console.error('Clipboard API failed:', err);
                    fallbackCopy();
                });
            } else {
                fallbackCopy();
            }
        } else {
            showMessage('No content to copy. Please convert some markdown first.', 'warning');
            announceToScreenReader('No content available to copy');
        }
        
        function fallbackCopy() {
            try {
                // Fallback: select text and execute copy command
                $('#markup').select();
                var successful = document.execCommand('copy');
                
                if (successful) {
                    showMessage('Successfully copied to clipboard!', 'success');
                    $button.html('<i class="bi bi-check me-1"></i>Copied').removeClass('btn-success').addClass('btn-outline-success');
                    announceToScreenReader('Content copied to clipboard');
                } else {
                    throw new Error('execCommand failed');
                }
                
                // Restore button after 2 seconds
                setTimeout(function() {
                    $button.html(originalHtml).removeClass('btn-outline-success').addClass('btn-success').prop('disabled', false);
                }, 2000);
                
            } catch (err) {
                console.error('Fallback copy failed:', err);
                showMessage('Copy failed. Please manually select and copy the text.', 'error');
                $button.prop('disabled', false);
                
                // Auto-select text for manual copy
                $('#markup').select();
            }
        }
    }
    
    function exportToFile() {
        var markup = $('#markup').val();
        if (!markup.trim()) {
            showMessage('No content to export. Please convert some markdown first.', 'warning');
            return;
        }
        
        var blob = new Blob([markup], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'confluence-markup.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showMessage('File exported successfully!', 'success');
        announceToScreenReader('Confluence markup exported to file');
    }
    
    function handleFileImport(event) {
        var file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.includes('text') && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
            showMessage('Please select a valid text or markdown file.', 'error');
            return;
        }
        
        var reader = new FileReader();
        reader.onload = function(e) {
            var content = e.target.result;
            $('#markdown').val(content);
            convertMarkdown(content);
            saveSession();
            showMessage('File imported successfully!', 'success');
            announceToScreenReader('File imported and converted');
        };
        reader.onerror = function() {
            showMessage('Failed to read file. Please try again.', 'error');
        };
        reader.readAsText(file);
        
        // Clear file input for next use
        event.target.value = '';
    }
    
    function initializeDragDrop() {
        var $markdown = $('#markdown');
        
        $markdown.on('dragover', function(e) {
            e.preventDefault();
            $(this).addClass('drag-over');
        });
        
        $markdown.on('dragleave', function(e) {
            e.preventDefault();
            $(this).removeClass('drag-over');
        });
        
        $markdown.on('drop', function(e) {
            e.preventDefault();
            $(this).removeClass('drag-over');
            
            var files = e.originalEvent.dataTransfer.files;
            if (files.length > 0) {
                var file = files[0];
                if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        $markdown.val(event.target.result);
                        convertMarkdown(event.target.result);
                        saveSession();
                        showMessage('File dropped and imported successfully!', 'success');
                        announceToScreenReader('File dropped and converted');
                    };
                    reader.readAsText(file);
                } else {
                    showMessage('Please drop a valid text or markdown file.', 'error');
                }
            }
        });
    }
    
    function initializeKeyboardShortcuts() {
        $(document).on('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        convertMarkdown($('#markdown').val());
                        announceToScreenReader('Converting markdown');
                        break;
                    case 'k': // Ctrl+K for copy
                        e.preventDefault();
                        copyToClipboard();
                        break;
                    case 's': // Ctrl+S for save/export
                        e.preventDefault();
                        exportToFile();
                        break;
                    case 'o': // Ctrl+O for open/import
                        e.preventDefault();
                        $('#import').click();
                        break;
                }
            }
            
            // Escape key to clear messages
            if (e.key === 'Escape') {
                $('#messages .alert').alert('close');
            }
        });
    }
    
    function saveSession() {
        var sessionData = {
            markdown: $('#markdown').val(),
            timestamp: Date.now()
        };
        try {
            localStorage.setItem('md2confluence-session', JSON.stringify(sessionData));
        } catch (e) {
            console.warn('Unable to save session to localStorage:', e);
        }
    }
    
    function loadSession() {
        try {
            var saved = localStorage.getItem('md2confluence-session');
            if (saved) {
                var data = JSON.parse(saved);
                // Only load if session is less than 24 hours old
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    $('#markdown').val(data.markdown);
                    if (data.markdown.trim()) {
                        convertMarkdown(data.markdown);
                    }
                    return true;
                }
            }
        } catch (e) {
            console.warn('Unable to load session from localStorage:', e);
        }
        return false;
    }
    
    function clearSession() {
        try {
            localStorage.removeItem('md2confluence-session');
        } catch (e) {
            console.warn('Unable to clear session from localStorage:', e);
        }
    }
    
    function announceToScreenReader(message) {
        var announcer = $('#status-announcer');
        if (announcer.length) {
            announcer.text(message);
        }
    }
    
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
});