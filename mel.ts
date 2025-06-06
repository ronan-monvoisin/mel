const melTools = {
  addClasses: (element: Element, classes: Array<string>): void => {
    classes.forEach(classe => element.classList.add(classe))
  },
  setAttribute: (element: Element, key: string, value: string): void => {
    this.getElement().setAttribute(key, value);
  },
  setData: (element: Element, key: string, value: string): void => {
    this.getElement().dataset[key] = value;
  }
}

class Mel {
  private element: any;

  constructor(elementType: string) {
    this.element = document.createElement(elementType);
  }

  class(value: string | Array<string>): Mel {
    if (typeof value !== 'string' && !Array.isArray(value)) {
      throw new Error('The value argument must be a string or an array of strings.');
    }

    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
      // If value is null, undefined, an empty array, or an empty string, do nothing
      return this;
    }

    if (!Array.isArray(value)) {
      value = value.split(' ');
      return this;
    }

    melTools.addClasses(this.getElement(), value);
    return this;
  }

  attr(attributes: object | string, value: string | null): Mel {
    if (typeof attributes !== 'object' && typeof attributes !== 'string') {
      throw new Error('The attributes argument must be an object or a string.');
    }
    if (Array.isArray(attributes)) {
      throw new Error('The attributes argument cannot be an array. Use an object or a string instead.');
    }

    if (typeof attributes === 'string') {
      melTools.setAttribute(this.getElement(), attributes, value ?? '');
      return this;
    }
    for (const [key, value] of Object.entries(attributes)) {
      if (typeof key !== 'string') {
        throw new Error('The key in the attributes object must be a string.');
      }

      melTools.setAttribute(this.getElement(), key, value ?? '');
    }
    return this;
  }

  data(data: object | string, value: string | null): Mel {
    if (typeof data !== 'object' && typeof data !== 'string') {
      throw new Error('The data argument must be an object or a string.');
    }
    if (Array.isArray(data)) {
      throw new Error('The data argument cannot be an array. Use an object or a string instead.');
    }
    if (data === null) {
      throw new Error('The data argument cannot be null.');
    }
    if (typeof data === 'string') {
      melTools.setData(this.getElement(), data, value ?? '');
      return this;
    }
    for (const [key, value] of Object.entries(data)) {
      if (typeof key !== 'string') {
        throw new Error('The key in the data object must be a string.');
      }

      melTools.setData(this.getElement(), key, value);
    }
    return this;
  }

  attribute(key: string, value: any): Mel {
    if (typeof key !== 'string') {
      throw new Error('The key argument must be a string representing the attribute name.');
    }

    melTools.setAttribute(this.getElement(), key, value ?? '');
    return this;
  }

  listeners(listeners: object): Mel {
    if (typeof listeners !== 'object' || Array.isArray(listeners)) {
      throw new Error('The listeners argument must be an object with event names as keys and handler functions as values.');
    }
    if (Object.keys(listeners).length === 0) {
      return this;
    }
    for (const [event, handler] of Object.entries(listeners)) {
      if (typeof handler !== 'function') {
        throw new Error(`The handler for event "${event}" must be a function.`);
      }
      this.getElement().addEventListener(event, handler);
    }
    return this;
  }

  children(children: Array<Element | Mel>): Mel {
    if (!Array.isArray(children)) {
      throw new Error('The children argument must be an array of Element or Mel instances.');
    }
    if (children.length === 0) {
      return this;
    }
    if (children.some(child => !(child instanceof Element || child instanceof Mel))) {
      throw new Error('All children must be instances of Element or Mel.');
    }

    children.forEach(child => {
      if (child instanceof Mel) {
        this.getElement().appendChild(child.getElement());
      } else if (child instanceof Element) {
        this.getElement().appendChild(child);
      }
    });
    return this;
  }

  getElement(): Element {
    return this.element;
  }
}

function mel(type: string, options: object = {}, children: string|Array<Element | Mel> = ''): Element {
  if (typeof type !== 'string') {
    throw new Error('The first argument must be a string representing the element type.');
  }
  if (typeof options !== 'object') {
    throw new Error('The second argument must be an object containing options.');
  }

  const element = new Mel(type);

  for (const [key, value] of Object.entries(options)) {
    if (typeof element[key] === 'function') {
      element[key](key, value);
    } else if (typeof element.getElement()[key] === 'function') {
      element.getElement()[key](value);
    } else {
      element.getElement()[key] = value;
    }
  }

  if (typeof children === 'string') {
    element.getElement().textContent = children;
  } else {
    element.children(children);
  }

  return element.getElement();
}