// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(onDocumentOpen)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'auto-fold-python.foldAllProperty',
            foldAllProperty
        )
    )
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'auto-fold-python.unfoldAllProperty',
            unfoldAllProperty
        )
    )
}

// This method is called when your extension is deactivated
export function deactivate() { }

function onDocumentOpen(editor?: vscode.TextEditor) {
    if (!editor) return
    if (editor.document.languageId !== 'python') return

    foldAllProperty(editor.document)
}

function foldAllProperty(document?: vscode.TextDocument) {
    if (document === undefined && vscode.window.activeTextEditor !== undefined) {
        document = vscode.window.activeTextEditor.document
    }
    if (document === undefined) return

    vscode.commands.executeCommand('editor.fold', {
        level: 1,
        direction: 'up',
        selectionLines: getPropertyLineNumbers(document),
    })
}

function unfoldAllProperty() {
    if (!vscode.window.activeTextEditor) return

    vscode.commands.executeCommand('editor.unfold', {
        level: 1,
        direction: 'up',
        selectionLines: getPropertyLineNumbers(vscode.window.activeTextEditor.document),
    })
}

function getPropertyLineNumbers(document: vscode.TextDocument): number[] {
    const openingPropertyRegex = /^ *@property$/g
    let propertyOpeningLineNumbers = []

    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
        let line = document.lineAt(lineNumber)

        if (openingPropertyRegex.test(line.text))
            propertyOpeningLineNumbers.push(lineNumber + 1)
    }
    return propertyOpeningLineNumbers
}
