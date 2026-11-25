const terminal = document.querySelector(".terminal");
const copyButton = terminal.querySelector(".copy-commands");
const copyStatus = terminal.querySelector(".copy-status");
let resetCopyLabel;

if (navigator.clipboard?.writeText) {
    copyButton.hidden = false;
    copyButton.addEventListener("click", async () => {
        const commands = Array.from(terminal.querySelectorAll(".command"), command => command.textContent);
        clearTimeout(resetCopyLabel);

        try {
            await navigator.clipboard.writeText(commands.join("\n"));
            copyButton.textContent = "Copied";
            copyStatus.textContent = "Setup commands copied to the clipboard.";
        } catch {
            copyButton.textContent = "Try again";
            copyStatus.textContent = "Could not copy setup commands. Select and copy them from the terminal.";
        }

        resetCopyLabel = setTimeout(() => {
            copyButton.textContent = "Copy";
            copyStatus.textContent = "";
        }, 2400);
    });
}
