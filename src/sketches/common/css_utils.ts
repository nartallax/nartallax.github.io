/** Add named piece of CSS to page
 * If another piece of CSS with the same name exists, it is discarded */
export function addCssToPage(name: string, content: string): void {
	document.querySelector(`*[data-style-name="${name}"]`)?.remove();
	
	let el = document.createElement("style");
	el.setAttribute("type", "text/css");
	el.setAttribute("data-style-name", name);
	el.appendChild(document.createTextNode(content))
	document.head.appendChild(el);
}