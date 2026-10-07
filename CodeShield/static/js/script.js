/**
 * CodeShield – Intelligent Source Code Security & Privacy Analyzer
 * Client-Side Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Auto-dismiss flash alerts after 5 seconds
    const flashMessages = document.querySelectorAll('.flash');
    if (flashMessages.length > 0) {
        setTimeout(() => {
            flashMessages.forEach(el => {
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.4s ease';
                setTimeout(() => el.remove(), 400);
            });
        }, 5000);
    }

    // Drag-over styling for dropzones
    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.style.borderColor = '#06b6d4';
                dropzone.style.background = 'rgba(6, 182, 212, 0.1)';
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                dropzone.style.background = 'rgba(6, 182, 212, 0.02)';
            });
        });

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            const fileInput = document.getElementById('fileInput');
            if (files.length > 0 && fileInput) {
                fileInput.files = files;
                const fileNameSpan = document.getElementById('selectedFileName');
                const infoBox = document.getElementById('fileSelectedInfo');
                if (fileNameSpan && infoBox) {
                    fileNameSpan.textContent = files[0].name;
                    infoBox.style.display = 'inline-block';
                }
            }
        });
    }
});
