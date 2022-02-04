#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib')

const app = Application.currentApplication()
app.includeStandardAdditions = true

const cancel = process.env.CANCEL;
const ok = process.env.OK;

const result = app.displayDialog(process.env.DIALOG, {
  defaultAnswer: '',
  withIcon: 'caution',
  buttons: [cancel, ok],
  defaultButton: ok,
  hiddenAnswer: true,
})

if (result.buttonReturned === ok) {
  result.textReturned
} else {
  $.exit(255)
}

