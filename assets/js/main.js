// ---------------------
// Helpers
// ---------------------

/**
 * Gets an attribute of an element if it
 * exists or null if it doesn't.
 * 
 * @param {String} element The HTML element with the attribute
 * @param {String} attribute The attribute name you're looking for
 * @returns {String} The string value of the attribute 
 */
function GetAttrValue(element, attribute)
{
    return element.hasAttribute(attribute)
        ? element.getAttribute(attribute)
        : null;
};

// ---------------------
// Document Functions
// ---------------------

/**
 * Initialize Graphs on the page.
 * 
 * @returns {void}
 */
function InitializeGraphs()
{
    const graphs = document.querySelectorAll(".graph");

    graphs.forEach(graph => {
        const groups = graph.querySelectorAll(".groups .group");
        
        groups.forEach(group => {
            const min = GetAttrValue(group, "data-min") ?? 0;
            const max = GetAttrValue(group, "data-max") ?? 100;
            const unit = GetAttrValue(group, "data-unit") ?? "%";

            const bars = group.querySelectorAll(".bar");
            
            bars.forEach(bar => {
                const value = GetAttrValue(bar, "data-value");
                
                if (bar.hasAttribute("data-unit") === false) {
                    bar.setAttribute("data-unit", unit);
                }

                if (value === null) {
                    bar.classList.add("error");
                    bar.style.width = "100%";
                }
                
                const percentage = parseFloat(value) / max * 100;
                bar.style.maxWidth = `${percentage}%`;
            });
        })
    });
}

/**
 * Initialize "Terminal"'s Copy to Clipboard Button
 * 
 * Make sure the browser supports copying to the
 * clipboard, attach event handlers and make buttons visible.
 * 
 * @returns {void}
 */
function InitializeTerminalCopyToClipboardButtons()
{
    // If the browser doesn't support
    // clipboard features, remove the button. 
    if (typeof(navigator.clipboard?.writeText) !== 'function') {
        console.warn('The browser doesn\'t support clipboard features.');
        return;
    }

    // Attach event listener to all buttons we can find
    [...document.querySelectorAll('button.copy-to-clipboard')]
        .forEach(btn => {
            btn.classList.remove('hidden');
            btn.addEventListener('click', CopyTerminalCommandsToClipboard);
        });
}

/**
 * Copy Terminal Commands to Clipboard
 * 
 * Copies the "terminal"'s command into the user's
 * clipboard, so they can paste them into their
 * system terminal and get started using Photino.
 * 
 * @param {MouseEvent} event 
 * @returns {void}
 */
function CopyTerminalCommandsToClipboard(event)
{
    if (!event) {
        console.error("ArgumentNullException: 'self' doesn't accept null as argument.");
        return;
    }

    const button = event.target;
    const terminal = button.closest('.terminal');
    
    if (!terminal) {
        console.log("NullReferenceException: Could not find parent terminal.");
        return;
    }

    const commands = [
            ...terminal.querySelectorAll('.command')
        ]
        .map(command => command.innerText)
        .join("\n");
    
    navigator
        .clipboard
        .writeText(commands)
        .then(() => {
            button.classList.add("copied");
            window.setTimeout(() => {
                button.classList.remove("copied");
            }, 2000);
        })
        .catch(error => {
            button.classList.add("error");
            alert(`Error copying commands: ${error}`);
            
            window.setTimeout(() => {
                button.classList.remove("error");
            }, 2000);
        });
}

// -----------------------
// Document Initialization
// -----------------------
window.onload = () => {
    InitializeGraphs();
    InitializeTerminalCopyToClipboardButtons();
};