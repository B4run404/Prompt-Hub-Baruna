/**
 * Markdown Editor Wrapper using EasyMDE
 */

export function initMarkdownEditor(textareaId) {
    if (!document.getElementById(textareaId)) {
        throw new Error(`Textarea with id ${textareaId} not found`);
    }

    const easyMDE = new EasyMDE({
        element: document.getElementById(textareaId),
        spellChecker: false,
        autofocus: false,
        status: ['lines', 'words', 'cursor'],
        toolbar: [
            "bold", "italic", "heading", "|",
            "quote", "unordered-list", "ordered-list", "|",
            "link", "image", "|",
            "preview", "side-by-side", "fullscreen", "|",
            "guide"
        ]
    });

    return easyMDE;
}

export function parseMarkdown(markdownText) {
    if (typeof marked !== 'undefined') {
        return marked.parse(markdownText);
    }
    return markdownText;
}
