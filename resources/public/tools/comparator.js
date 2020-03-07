import MutableAttributes from "./mutable-attributes.js";

function initializeItemToCompare(root, itemName) {
    const itemProps = {}
    itemProps[DATA_ITEM_KEY] = itemName;
    root.appendChild(
        renderElement('div', itemProps,
            renderElement('h2', {}, itemName),
            renderItemAttribute()));
};

function renderAttribute(removable = false) {
    const attributeKey = nextAttributeKey();
    return renderElement('div', {class: 'text-center'},
        renderElement('input', propertiesWithDataAttribute({
            type: 'text',
            value: attributeKey,
            onkeyup: function (e) {
                const previousAttribute = this.getAttribute(DATA_ATTRIBUTE_KEY);
                const newName = this.value.trim();
                const newAttribute = toLegalAttributeName(newName);
                if (newAttribute == '') {
                    return
                }
                updateItemAttribute(this, newAttribute);
                updateAttributeName(previousAttribute, newAttribute, newName);
            }
        }, attributeKey)),
        renderElement('button', {
            onclick: (e) => {
                if (removable) {
                    const parent = e.target.parentNode;
                    const attrValue = parent.querySelector('input[value]').value;
                    const attributesItems = findItemsAttributeOfName(attrValue);
                    attributesItems.forEach(e => e.remove());
                    attributesValues.removeAttribute(attrValue);
                    parent.remove();
                }
            }
        }, '-'),
        renderElement('button', {
            onclick: (e) => {
                attributesValues.addAtribute(nextAttributeKey(true));
                e.target.parentNode.appendChild(renderAttribute(true));
                findAllToCompareItems().forEach(e => e.appendChild(renderItemAttribute()));
            }
        }, '+'));
}

function renderItemToCompare(name, removable=false) {
    return renderElement('div', {}, renderElement('input', {
        type: 'text',
        value: name,
        onkeyup: function (e) {
            console.log('Change...', e);
        }
    }, name),
    renderElement('button', {
        onclick: (e) => {
            if (removable) {
                const parent = e.target.parentNode;
                const attrValue = parent.querySelector('input[value]').value;
            }
        }
    }, '-'),
    renderElement('button', {
        onclick: (e) => {

        }
    }, '+'));
}

function toLegalAttributeName(newName) {
    return newName.replace(/ /g, '_');
}

function updateAttributeName(previousAttribute, newAttribute, newName) {
    const attributeElements = findItemsAttributeOfName(previousAttribute);
    attributeElements.forEach(e => {
        updateItemAttribute(e, newAttribute);
        Array.from(e.children).forEach(c => {
            updateItemAttribute(c, newAttribute);
            const name = c.nodeName.toLowerCase();
            if (name == 'h3') {
                c.innerText = newName;
            } else if (name == 'input' && c.placeholder == '') {
                c.placeholder = newName;
            }
        });
    });
    attributesValues.renameAttribute(previousAttribute, newAttribute);
}

function findAllToCompareItems() {
    return document.querySelectorAll(`*[${DATA_ITEM_KEY}]`);
}

function findItemsAttributeOfName(name) {
    return document.querySelectorAll(`div[${DATA_ATTRIBUTE_KEY}='${name}']`);
}

function updateItemAttribute(item, newName) {
    item.setAttribute(DATA_ATTRIBUTE_KEY, newName);
}

function nextItemKey(increment = false) {
    if (increment) {
        ++itemsCounter;
    }
    return `Item${itemsCounter}`;
}

function nextAttributeKey(increment = false) {
    if (increment) {
        ++attributeCounter;
    }
    return `attribute${attributeCounter}`;
}

function renderItemAttribute() {
    const attributeKey = nextAttributeKey();
    return renderElement('div', propertiesWithDataAttribute({'class': 'item-attribute'}, attributeKey),
        renderElement('h3', emptyPropertiesWithDataAttribute(attributeKey), `${attributeKey}`),
        renderElement('input', propertiesWithDataAttribute({ type: 'text', placeholder: 'Value' },
            attributeKey)));
}

function propertiesWithDataAttribute(properties, attributeValue) {
    properties[DATA_ATTRIBUTE_KEY] = attributeValue;
    return properties;
}

function emptyPropertiesWithDataAttribute(attributeValue) {
    return propertiesWithDataAttribute({}, attributeValue);
}

function renderElement(type, properties, ...children) {
    const dom = document.createElement(type);
    for (const k in properties) {
        const value = properties[k];
        if (typeof value == 'function') {
            dom[k] = value;
        } else {
            dom.setAttribute(k, value);
        }
    }
    for (const child of children) {
        if (typeof child == 'string') {
            dom.appendChild(document.createTextNode(child));
        } else {
            dom.appendChild(child);
        }
    }
    return dom;
}

const attributes = document.getElementById('attributes');
const items = document.getElementById('items');
const comparatorBody = document.getElementsByClassName('comparator')[0];

const DATA_ATTRIBUTE_KEY = 'data-attribute';
const DATA_ITEM_KEY = 'data-item';
const DATA_ITEM_NAME = 'data-item-name';
let attributeCounter = 1;
let itemsCounter = 1;
const attributesValues = new MutableAttributes();
attributesValues.addAtribute(nextAttributeKey());
console.log('Attibutes...', attributesValues);

attributes.appendChild(renderAttribute());

let firstItem = nextItemKey();
let secondItem = nextItemKey(true);

items.appendChild(renderItemToCompare(firstItem));
items.appendChild(renderItemToCompare(secondItem));
initializeItemToCompare(comparatorBody, firstItem);
initializeItemToCompare(comparatorBody, secondItem);