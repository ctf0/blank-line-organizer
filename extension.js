const vscode = require('vscode')
let config

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // initialize configuration
    readConfig()

    // reload configuration on change
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('blankLine')) {
            readConfig()
        }
    })

    context.subscriptions.push(
        vscode.commands.registerCommand('blankLine.process', (e) => applyReplacements())
    )
}

async function readConfig() {
    config = await getConfig()
}

async function getConfig() {
    return vscode.workspace.getConfiguration('blankLine')
}

async function applyReplacements() {

    let editor = vscode.window.activeTextEditor
    let doc = editor.document
    let txt = doc.getText()
    let regex = new RegExp(/\n{3,}/, 'gi')

    if (isValidLanguage(doc.languageId) && needChanges(txt, regex)) {
        let fullRange = new vscode.Range(
            doc.positionAt(0),
            doc.positionAt(txt.length - 1)
        )

        await editor.edit((edit) => edit.replace(fullRange, replaceTxt(txt, regex)))

        return vscode.window.showInformationMessage('Blank Line Organizer: all done')
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

function needChanges(txt, regex) {
    return regex.test(txt)
}
function replaceTxt(txt, regex) {
    return txt.replace(regex, config.keepOneEmptyLine ? '\n\n' : '\n')
}

exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
