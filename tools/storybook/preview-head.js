/** Dynamically add common `<head>` content to the preview iFrame. */

const fontLink = document.createElement('link');
fontLink.setAttribute('rel', 'stylesheet');
fontLink.setAttribute('href', 'https://fonts.googleapis.com/css?family=Noto+Sans:400,700');

const css = `
* {
	box-sizing: border-box;
}

html,
body,
#root {
	height: 100%;
	width: 100%;
	background-color: white;
}

body {
	margin: 0;
	font-family: 'Noto Sans', sans-serif;
}
`;
const styleElement = document.createElement('style');
styleElement.appendChild(document.createTextNode(css));

window.document.head.append(fontLink, styleElement);
