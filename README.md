# Mel - make element
JS lib for Element creation

## How it works

`mel.ts` provides a mini-library to create and manipulate DOM elements in a fluent and structured way.

### Main class: `Mel`

- **Constructor**:  
  Creates an HTML element of the given type (`document.createElement(elementType)`).

- **Methods**:
  - `class(value)`: Adds one or more CSS classes (as a string or array).
  - `attr(attributes, value)`: Adds one or more HTML attributes.
  - `data(data, value)`: Adds one or more `data-*` attributes.
  - `attribute(key, value)`: Adds a single attribute.
  - `listeners(listeners)`: Adds event listeners.
  - `children(children)`: Appends children (elements or Mel instances).
  - `getElement()`: Returns the native DOM element.

### Utility function: `mel`

Allows you to create an element in a single line:
- 1st argument: element type (e.g. `'div'`)
- 2nd argument: options object (attributes, classes, etc.)
- 3rd argument: array of children or string

#### Example with an array of classes:
```typescript
const btn = mel('button', {
  class: ['my-btn', 'primary', 'large'],
  attr: { type: 'button' },
  listeners: { 
    click: () => alert('clicked!') }
  },
  document.createTextNode('Click me')
);
document.body.appendChild(btn);
```