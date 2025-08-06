// 客户端JavaScript - 服务器版本
$(document).ready(function() {
    // 演示markdown内容
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

    // 初始化
    init();

    // 转换按钮点击事件
    $('#convert').click(function() {
        var markdown = $('#markdown').val();
        convertMarkdown(markdown);
    });

    // 清除按钮点击事件
    $('#clear').click(function() {
        $('#markdown').val('');
        $('#markup').val('');
        $('#markdown').focus();
    });

    // 复制按钮点击事件
    $('#copy').click(function() {
        var markup = $('#markup').val();
        var $button = $(this);
        var originalText = $button.text();
        
        if (markup.trim()) {
            // 禁用按钮防止重复点击
            $button.prop('disabled', true);
            
            // 尝试使用现代 Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(markup).then(function() {
                    showMessage('✅ 已成功复制到剪贴板！', 'success');
                    $button.text('✅ 已复制').removeClass('btn-success').addClass('btn-outline-success');
                    
                    // 2秒后恢复按钮状态
                    setTimeout(function() {
                        $button.text(originalText).removeClass('btn-outline-success').addClass('btn-success').prop('disabled', false);
                    }, 2000);
                }).catch(function(err) {
                    console.error('Clipboard API failed:', err);
                    fallbackCopy();
                });
            } else {
                fallbackCopy();
            }
        } else {
            showMessage('⚠️ 没有内容可复制，请先转换一些markdown内容', 'warning');
        }
        
        function fallbackCopy() {
            try {
                // 备选方案：选择文本并执行复制命令
                $('#markup').select();
                var successful = document.execCommand('copy');
                
                if (successful) {
                    showMessage('✅ 已成功复制到剪贴板！', 'success');
                    $button.text('✅ 已复制').removeClass('btn-success').addClass('btn-outline-success');
                } else {
                    throw new Error('execCommand failed');
                }
                
                // 2秒后恢复按钮状态
                setTimeout(function() {
                    $button.text(originalText).removeClass('btn-outline-success').addClass('btn-success').prop('disabled', false);
                }, 2000);
                
            } catch (err) {
                console.error('Fallback copy failed:', err);
                showMessage('❌ 复制失败，请手动选择并复制文本', 'error');
                $button.prop('disabled', false);
                
                // 自动选择文本供用户手动复制
                $('#markup').select();
            }
        }
    });

    // 实时转换（可选）
    $('#markdown').on('input', debounce(function() {
        if ($('#auto-convert').is(':checked')) {
            var markdown = $(this).val();
            if (markdown.trim()) {
                convertMarkdown(markdown);
            }
        }
    }, 500));

    function init() {
        $('#markdown').val(demoMarkdown);
        convertMarkdown(demoMarkdown);
    }

    function convertMarkdown(markdown) {
        if (!markdown.trim()) {
            $('#markup').val('');
            return;
        }

        // 显示加载状态
        $('#convert').prop('disabled', true).text('转换中...');
        $('#markup').val('转换中，请稍候...');

        // 发送API请求
        $.ajax({
            url: '/api/convert',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ markdown: markdown }),
            success: function(response) {
                if (response.success) {
                    $('#markup').val(response.markup);
                    showMessage('转换成功！', 'success');
                } else {
                    $('#markup').val('转换失败: ' + response.error);
                    showMessage('转换失败: ' + response.error, 'error');
                }
            },
            error: function(xhr, status, error) {
                var errorMsg = '网络错误或服务器无响应';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg = xhr.responseJSON.error;
                }
                $('#markup').val('转换失败: ' + errorMsg);
                showMessage('转换失败: ' + errorMsg, 'error');
            },
            complete: function() {
                $('#convert').prop('disabled', false).text('转换');
            }
        });
    }

    function showMessage(message, type) {
        var className = 'alert alert-' + (type === 'error' ? 'danger' : type);
        var alertHtml = '<div class="' + className + ' alert-dismissible fade show" role="alert">' +
                       message +
                       '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
                       '</div>';
        
        $('#messages').html(alertHtml);
        
        // 自动消失
        setTimeout(function() {
            $('#messages .alert').alert('close');
        }, 3000);
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