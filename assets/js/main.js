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
 * Copy commands from a terminal
 */
function CopyTerminalCommands(self)
{
    if (!self) {
        console.error("ArgumentNullException: 'self' doesn't accept null as argument.");
        return;
    }

    const terminal = self.closest('.terminal');
    
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
            self.classList.add("copied");
            window.setTimeout(() => {
                self.classList.remove("copied");
            }, 2000);
        })
        .catch(error => {
            self.classList.add("error");
            alert(`Error copying commands: ${error}`);
            
            window.setTimeout(() => {
                self.classList.remove("error");
            }, 2000);
        });
}

// -----------------------
// Document Initialization
// -----------------------
window.onload = () => {
    InitializeGraphs();
};