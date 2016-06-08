const slice = Array.prototype.slice;
export function removeChildren(node) {
    slice.call(node.childNodes).forEach(childNode => node.removeChild(childNode))
};
