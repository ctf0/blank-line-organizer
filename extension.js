const vscode = require('vscode')
const {EOL} = require('os')

let config = {}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    await readConfig()

    // reload configuration on change
    vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration('blankLine')) {
            await readConfig()
        }
    })

    context.subscriptions.push(vscode.commands.registerCommand('blankLine.process', applyReplacements))
}

async function readConfig() {
    return config = await vscode.workspace.getConfiguration('blankLine')
}

async function applyReplacements(e) {
    let editor = vscode.window.activeTextEditor
    let {document} = editor

    if (isValidLanguage(document.languageId)) {
        let txt = document.getText()

        if (!document.getText(new vscode.Range(0, 0, 3, 0)).match(/^\S/)) {
            txt = replaceTxt(txt, new RegExp(`^${EOL}{2,}`, 'm'), true)
        }

        txt = replaceTxt(txt, new RegExp(`^ {2,}${EOL}`, 'gm'), true, true)
        txt = replaceTxt(txt, new RegExp(`${EOL}{3,}`, 'gm'))

        await editor.edit(
            (edit) => edit.replace(new vscode.Range(0, 0, document.lineCount, 0), txt),
            {undoStopBefore: false, undoStopAfter: false}
        )
    }
}

function isValidLanguage(languageId) {
    let langIds = config.languageIds

    // for all
    if (langIds.length) {
        if (langIds[0] == '*') {
            return true
        }

        return langIds.some((id) => id.toLowerCase() === languageId.toLowerCase())
    }

    return false
}

function replaceTxt(txt, regex, all = false, addNewLine = false) {
    return all
        ? txt.replace(regex, addNewLine ? EOL : '')
        : txt.replace(regex, config.keepOneEmptyLine ? `${EOL}${EOL}` : EOL)
}

exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
