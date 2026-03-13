import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('"hex-calc" is now active!');

	const provider = new HexCalcViewProvider();

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('hexCalcView', provider)
	);
}

class HexCalcViewProvider implements vscode.WebviewViewProvider {
	public resolveWebviewView(webviewView: vscode.WebviewView): void {
		webviewView.webview.options = {
			enableScripts: true,
		};

		webviewView.webview.html = getWebviewContent();
	}
}

function getWebviewContent(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Hex Calculator</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			padding: 16px;
		}
		h1 {
			font-size: 20px;
			margin-bottom: 16px;
		}
		.row {
			margin-bottom: 12px;
			display: flex;
			gap: 8px;
			flex-wrap: wrap;
			align-items: center;
		}
		input, select, button {
			padding: 8px 10px;
			font-size: 14px;
		}
		input {
			width: 160px;
		}
		.result {
			margin-top: 16px;
			font-size: 16px;
			font-weight: bold;
			word-break: break-all;
		}
		.copy-row {
			margin-top: 10px;
		}
	</style>
</head>
<body>
	<h1>Hex Calculator</h1>

	<div class="row">
		<input type="text" id="inputA" placeholder="A (e.g. FF)" />
		<select id="operator">
			<option value="+">+</option>
			<option value="-">-</option>
			<option value="*">*</option>
			<option value="/">/</option>
		</select>
		<input type="text" id="inputB" placeholder="B (e.g. A)" />
		<button onclick="calculate()">Calculate</button>
	</div>

	<div class="result" id="result">Result: </div>

	<div class="copy-row">
		<button onclick="copyResult()">Copy</button>
	</div>

	<script>
		function parseHex(value) {
			value = value.trim();
			if (value.startsWith('0x') || value.startsWith('0X')) {
				value = value.slice(2);
			}
			if (value === '') {
				return null;
			}
			const n = parseInt(value, 16);
			return isNaN(n) ? null : n;
		}

		function calculate() {
			const aRaw = document.getElementById('inputA').value;
			const bRaw = document.getElementById('inputB').value;
			const op = document.getElementById('operator').value;
			const resultEl = document.getElementById('result');

			const a = parseHex(aRaw);
			const b = parseHex(bRaw);

			if (a === null || b === null) {
				resultEl.innerText = 'Result: Invalid hex input';
				return;
			}

			let result;
			if (op === '+') result = a + b;
			else if (op === '-') result = a - b;
			else if (op === '*') result = a * b;
			else if (op === '/') {
				if (b === 0) {
					resultEl.innerText = 'Result: Division by zero';
					return;
				}
				result = Math.floor(a / b);
			}

			resultEl.innerText = 'Result: 0x' + result.toString(16).toUpperCase();
		}

		function copyResult() {
			const resultEl = document.getElementById('result');
			const text = resultEl.innerText.replace('Result: ', '');
			navigator.clipboard.writeText(text);
		}
	</script>
</body>
</html>`;
}

export function deactivate() {}