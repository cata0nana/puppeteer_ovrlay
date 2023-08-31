/**
 * Copyright 2023 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Protocol} from 'devtools-protocol';

import {Frame} from '../api/Frame.js';
import {getQueryHandlerAndSelector} from '../common/GetQueryHandler.js';
import {WaitForSelectorOptions} from '../common/IsolatedWorld.js';
import {LazyArg} from '../common/LazyArg.js';
import {
  ElementFor,
  EvaluateFuncWith,
  HandleFor,
  HandleOr,
  NodeFor,
} from '../common/types.js';
import {KeyInput} from '../common/USKeyboardLayout.js';
import {isString, withSourcePuppeteerURLIfNone} from '../common/util.js';
import {assert} from '../util/assert.js';
import {AsyncIterableUtil} from '../util/AsyncIterableUtil.js';

import {
  KeyboardTypeOptions,
  KeyPressOptions,
  MouseClickOptions,
} from './Input.js';
import {JSHandle} from './JSHandle.js';
import {ScreenshotOptions} from './Page.js';

/**
 * @public
 */
export type Quad = [Point, Point, Point, Point];

/**
 * @public
 */
export interface BoxModel {
  content: Quad;
  padding: Quad;
  border: Quad;
  margin: Quad;
  width: number;
  height: number;
}

/**
 * @public
 */
export interface BoundingBox extends Point {
  /**
   * the width of the element in pixels.
   */
  width: number;
  /**
   * the height of the element in pixels.
   */
  height: number;
}

/**
 * @public
 */
export interface Offset {
  /**
   * x-offset for the clickable point relative to the top-left corner of the border box.
   */
  x: number;
  /**
   * y-offset for the clickable point relative to the top-left corner of the border box.
   */
  y: number;
}

/**
 * @public
 */
export interface ClickOptions extends MouseClickOptions {
  /**
   * Offset for the clickable point relative to the top-left corner of the border box.
   */
  offset?: Offset;
}

/**
 * @public
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * ElementHandle represents an in-page DOM element.
 *
 * @remarks
 * ElementHandles can be created with the {@link Page.$} method.
 *
 * ```ts
 * import puppeteer from 'puppeteer';
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://example.com');
 *   const hrefElement = await page.$('a');
 *   await hrefElement.click();
 *   // ...
 * })();
 * ```
 *
 * ElementHandle prevents the DOM element from being garbage-collected unless the
 * handle is {@link JSHandle.dispose | disposed}. ElementHandles are auto-disposed
 * when their origin frame gets navigated.
 *
 * ElementHandle instances can be used as arguments in {@link Page.$eval} and
 * {@link Page.evaluate} methods.
 *
 * If you're using TypeScript, ElementHandle takes a generic argument that
 * denotes the type of element the handle is holding within. For example, if you
 * have a handle to a `<select>` element, you can type it as
 * `ElementHandle<HTMLSelectElement>` and you get some nicer type checks.
 *
 * @public
 */
export abstract class ElementHandle<
  ElementType extends Node = Element,
> extends JSHandle<ElementType> {
  /**
   * @internal
   */
  protected readonly handle;

  /**
   * @internal
   */
  constructor(handle: JSHandle<ElementType>) {
    super();
    this.handle = handle;
  }

  /**
   * @internal
   */
  override get id(): string | undefined {
    return this.handle.id;
  }

  /**
   * @internal
   */
  override get disposed(): boolean {
    return this.handle.disposed;
  }

  /**
   * @internal
   */
  override async getProperty<K extends keyof ElementType>(
    propertyName: HandleOr<K>
  ): Promise<HandleFor<ElementType[K]>>;
  /**
   * @internal
   */
  override async getProperty(propertyName: string): Promise<JSHandle<unknown>>;
  override async getProperty<K extends keyof ElementType>(
    propertyName: HandleOr<K>
  ): Promise<HandleFor<ElementType[K]>> {
    return this.handle.getProperty(propertyName);
  }

  /**
   * @internal
   */
  override async getProperties(): Promise<Map<string, JSHandle>> {
    return this.handle.getProperties();
  }

  /**
   * @internal
   */
  override async evaluate<
    Params extends unknown[],
    Func extends EvaluateFuncWith<ElementType, Params> = EvaluateFuncWith<
      ElementType,
      Params
    >,
  >(
    pageFunction: Func | string,
    ...args: Params
  ): Promise<Awaited<ReturnType<Func>>> {
    return this.handle.evaluate(pageFunction, ...args);
  }

  /**
   * @internal
   */
  override evaluateHandle<
    Params extends unknown[],
    Func extends EvaluateFuncWith<ElementType, Params> = EvaluateFuncWith<
      ElementType,
      Params
    >,
  >(
    pageFunction: Func | string,
    ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>>> {
    return this.handle.evaluateHandle(pageFunction, ...args);
  }

  /**
   * @internal
   */
  override async jsonValue(): Promise<ElementType> {
    return this.handle.jsonValue();
  }

  /**
   * @internal
   */
  override toString(): string {
    return this.handle.toString();
  }

  /**
   * @internal
   */
  override remoteObject(): Protocol.Runtime.RemoteObject {
    return this.handle.remoteObject();
  }

  /**
   * @internal
   */
  override dispose(): Promise<void> {
    return this.handle.dispose();
  }

  override asElement(): ElementHandle<ElementType> {
    return this;
  }

  /**
   * Frame corresponding to the current handle.
   */
  abstract get frame(): Frame;

  /**
   * Queries the current element for an element matching the given selector.
   *
   * @param selector - The selector to query for.
   * @returns A {@link ElementHandle | element handle} to the first element
   * matching the given selector. Otherwise, `null`.
   */
  $<Selector extends string>(
    selector: Selector
  ): Promise<ElementHandle<NodeFor<Selector>> | null> {
    const {updatedSelector, QueryHandler} =
      getQueryHandlerAndSelector(selector);
    return QueryHandler.queryOne(
      this,
      updatedSelector
    ) as Promise<ElementHandle<NodeFor<Selector>> | null>;
  }

  /**
   * Queries the current element for all elements matching the given selector.
   *
   * @param selector - The selector to query for.
   * @returns An array of {@link ElementHandle | element handles} that point to
   * elements matching the given selector.
   */
  $$<Selector extends string>(
    selector: Selector
  ): Promise<Array<ElementHandle<NodeFor<Selector>>>> {
    const {updatedSelector, QueryHandler} =
      getQueryHandlerAndSelector(selector);
    return AsyncIterableUtil.collect(
      QueryHandler.queryAll(this, updatedSelector)
    ) as Promise<Array<ElementHandle<NodeFor<Selector>>>>;
  }

  /**
   * Runs the given function on the first element matching the given selector in
   * the current element.
   *
   * If the given function returns a promise, then this method will wait till
   * the promise resolves.
   *
   * @example
   *
   * ```ts
   * const tweetHandle = await page.$('.tweet');
   * expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe(
   *   '100'
   * );
   * expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe(
   *   '10'
   * );
   * ```
   *
   * @param selector - The selector to query for.
   * @param pageFunction - The function to be evaluated in this element's page's
   * context. The first element matching the selector will be passed in as the
   * first argument.
   * @param args - Additional arguments to pass to `pageFunction`.
   * @returns A promise to the result of the function.
   */
  async $eval<
    Selector extends string,
    Params extends unknown[],
    Func extends EvaluateFuncWith<NodeFor<Selector>, Params> = EvaluateFuncWith<
      NodeFor<Selector>,
      Params
    >,
  >(
    selector: Selector,
    pageFunction: Func | string,
    ...args: Params
  ): Promise<Awaited<ReturnType<Func>>> {
    pageFunction = withSourcePuppeteerURLIfNone(this.$eval.name, pageFunction);
    using elementHandle = await this.$(selector);
    if (!elementHandle) {
      throw new Error(
        `Error: failed to find element matching selector "${selector}"`
      );
    }
    return elementHandle.evaluate(pageFunction, ...args);
  }

  /**
   * Runs the given function on an array of elements matching the given selector
   * in the current element.
   *
   * If the given function returns a promise, then this method will wait till
   * the promise resolves.
   *
   * @example
   * HTML:
   *
   * ```html
   * <div class="feed">
   *   <div class="tweet">Hello!</div>
   *   <div class="tweet">Hi!</div>
   * </div>
   * ```
   *
   * JavaScript:
   *
   * ```js
   * const feedHandle = await page.$('.feed');
   * expect(
   *   await feedHandle.$$eval('.tweet', nodes => nodes.map(n => n.innerText))
   * ).toEqual(['Hello!', 'Hi!']);
   * ```
   *
   * @param selector - The selector to query for.
   * @param pageFunction - The function to be evaluated in the element's page's
   * context. An array of elements matching the given selector will be passed to
   * the function as its first argument.
   * @param args - Additional arguments to pass to `pageFunction`.
   * @returns A promise to the result of the function.
   */
  async $$eval<
    Selector extends string,
    Params extends unknown[],
    Func extends EvaluateFuncWith<
      Array<NodeFor<Selector>>,
      Params
    > = EvaluateFuncWith<Array<NodeFor<Selector>>, Params>,
  >(
    selector: Selector,
    pageFunction: Func | string,
    ...args: Params
  ): Promise<Awaited<ReturnType<Func>>> {
    pageFunction = withSourcePuppeteerURLIfNone(this.$$eval.name, pageFunction);
    const results = await this.$$(selector);
    using elements = await this.evaluateHandle(
      (_, ...elements) => {
        return elements;
      },
      ...results
    );
    const [result] = await Promise.all([
      elements.evaluate(pageFunction, ...args),
      ...results.map(results => {
        return results.dispose();
      }),
    ]);
    return result;
  }

  /**
   * @deprecated Use {@link ElementHandle.$$} with the `xpath` prefix.
   *
   * Example: `await elementHandle.$$('xpath/' + xpathExpression)`
   *
   * The method evaluates the XPath expression relative to the elementHandle.
   * If `xpath` starts with `//` instead of `.//`, the dot will be appended
   * automatically.
   *
   * If there are no such elements, the method will resolve to an empty array.
   * @param expression - Expression to {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate | evaluate}
   */
  $x(expression: string): Promise<Array<ElementHandle<Node>>> {
    if (expression.startsWith('//')) {
      expression = `.${expression}`;
    }
    return this.$$(`xpath/${expression}`);
  }

  /**
   * Wait for an element matching the given selector to appear in the current
   * element.
   *
   * Unlike {@link Frame.waitForSelector}, this method does not work across
   * navigations or if the element is detached from DOM.
   *
   * @example
   *
   * ```ts
   * import puppeteer from 'puppeteer';
   *
   * (async () => {
   *   const browser = await puppeteer.launch();
   *   const page = await browser.newPage();
   *   let currentURL;
   *   page
   *     .mainFrame()
   *     .waitForSelector('img')
   *     .then(() => console.log('First URL with image: ' + currentURL));
   *
   *   for (currentURL of [
   *     'https://example.com',
   *     'https://google.com',
   *     'https://bbc.com',
   *   ]) {
   *     await page.goto(currentURL);
   *   }
   *   await browser.close();
   * })();
   * ```
   *
   * @param selector - The selector to query and wait for.
   * @param options - Options for customizing waiting behavior.
   * @returns An element matching the given selector.
   * @throws Throws if an element matching the given selector doesn't appear.
   */
  waitForSelector<Selector extends string>(
    selector: Selector,
    options: WaitForSelectorOptions = {}
  ): Promise<ElementHandle<NodeFor<Selector>> | null> {
    const {updatedSelector, QueryHandler} =
      getQueryHandlerAndSelector(selector);
    return QueryHandler.waitFor(
      this,
      updatedSelector,
      options
    ) as Promise<ElementHandle<NodeFor<Selector>> | null>;
  }

  async #checkVisibility(visibility: boolean): Promise<boolean> {
    using element = await this.frame.isolatedRealm().adoptHandle(this);
    return await this.frame.isolatedRealm().evaluate(
      async (PuppeteerUtil, element, visibility) => {
        return Boolean(PuppeteerUtil.checkVisibility(element, visibility));
      },
      LazyArg.create(context => {
        return context.puppeteerUtil;
      }),
      element,
      visibility
    );
  }

  /**
   * Checks if an element is visible using the same mechanism as
   * {@link ElementHandle.waitForSelector}.
   */
  isVisible(): Promise<boolean> {
    return this.#checkVisibility(true);
  }

  /**
   * Checks if an element is hidden using the same mechanism as
   * {@link ElementHandle.waitForSelector}.
   */
  isHidden(): Promise<boolean> {
    return this.#checkVisibility(false);
  }

  /**
   * @deprecated Use {@link ElementHandle.waitForSelector} with the `xpath`
   * prefix.
   *
   * Example: `await elementHandle.waitForSelector('xpath/' + xpathExpression)`
   *
   * The method evaluates the XPath expression relative to the elementHandle.
   *
   * Wait for the `xpath` within the element. If at the moment of calling the
   * method the `xpath` already exists, the method will return immediately. If
   * the `xpath` doesn't appear after the `timeout` milliseconds of waiting, the
   * function will throw.
   *
   * If `xpath` starts with `//` instead of `.//`, the dot will be appended
   * automatically.
   *
   * @example
   * This method works across navigation.
   *
   * ```ts
   * import puppeteer from 'puppeteer';
   * (async () => {
   *   const browser = await puppeteer.launch();
   *   const page = await browser.newPage();
   *   let currentURL;
   *   page
   *     .waitForXPath('//img')
   *     .then(() => console.log('First URL with image: ' + currentURL));
   *   for (currentURL of [
   *     'https://example.com',
   *     'https://google.com',
   *     'https://bbc.com',
   *   ]) {
   *     await page.goto(currentURL);
   *   }
   *   await browser.close();
   * })();
   * ```
   *
   * @param xpath - A
   * {@link https://developer.mozilla.org/en-US/docs/Web/XPath | xpath} of an
   * element to wait for
   * @param options - Optional waiting parameters
   * @returns Promise which resolves when element specified by xpath string is
   * added to DOM. Resolves to `null` if waiting for `hidden: true` and xpath is
   * not found in DOM, otherwise resolves to `ElementHandle`.
   * @remarks
   * The optional Argument `options` have properties:
   *
   * - `visible`: A boolean to wait for element to be present in DOM and to be
   *   visible, i.e. to not have `display: none` or `visibility: hidden` CSS
   *   properties. Defaults to `false`.
   *
   * - `hidden`: A boolean wait for element to not be found in the DOM or to be
   *   hidden, i.e. have `display: none` or `visibility: hidden` CSS properties.
   *   Defaults to `false`.
   *
   * - `timeout`: A number which is maximum time to wait for in milliseconds.
   *   Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The
   *   default value can be changed by using the {@link Page.setDefaultTimeout}
   *   method.
   */
  waitForXPath(
    xpath: string,
    options: {
      visible?: boolean;
      hidden?: boolean;
      timeout?: number;
    } = {}
  ): Promise<ElementHandle<Node> | null> {
    if (xpath.startsWith('//')) {
      xpath = `.${xpath}`;
    }
    return this.waitForSelector(`xpath/${xpath}`, options);
  }

  /**
   * Converts the current handle to the given element type.
   *
   * @example
   *
   * ```ts
   * const element: ElementHandle<Element> = await page.$(
   *   '.class-name-of-anchor'
   * );
   * // DO NOT DISPOSE `element`, this will be always be the same handle.
   * const anchor: ElementHandle<HTMLAnchorElement> =
   *   await element.toElement('a');
   * ```
   *
   * @param tagName - The tag name of the desired element type.
   * @throws An error if the handle does not match. **The handle will not be
   * automatically disposed.**
   */
  async toElement<
    K extends keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap,
  >(tagName: K): Promise<HandleFor<ElementFor<K>>> {
    const isMatchingTagName = await this.evaluate((node, tagName) => {
      return node.nodeName === tagName.toUpperCase();
    }, tagName);
    if (!isMatchingTagName) {
      throw new Error(`Element is not a(n) \`${tagName}\` element`);
    }
    return this as unknown as HandleFor<ElementFor<K>>;
  }

  /**
   * Resolves the frame associated with the element, if any. Always exists for
   * HTMLIFrameElements.
   */
  abstract contentFrame(this: ElementHandle<HTMLIFrameElement>): Promise<Frame>;
  abstract contentFrame(): Promise<Frame | null>;

  /**
   * Returns the middle point within an element unless a specific offset is provided.
   */
  async clickablePoint(offset?: Offset): Promise<Point> {
    using adoptedThis = await this.frame.isolatedRealm().adoptHandle(this);
    const box = await adoptedThis.#clickableBox();
    if (!box) {
      throw new Error('Node is either not clickable or not an Element');
    }
    if (offset !== undefined) {
      return {
        x: box.x + offset.x,
        y: box.y + offset.y,
      };
    }
    return {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    };
  }

  /**
   * This method scrolls element into view if needed, and then
   * uses {@link Page} to hover over the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  async hover(this: ElementHandle<Element>): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    const {x, y} = await this.clickablePoint();
    await this.frame.page().mouse.move(x, y);
  }

  /**
   * This method scrolls element into view if needed, and then
   * uses {@link Page | Page.mouse} to click in the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  async click(
    this: ElementHandle<Element>,
    options: Readonly<ClickOptions> = {}
  ): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    const {x, y} = await this.clickablePoint(options.offset);
    await this.frame.page().mouse.click(x, y, options);
  }

  /**
   * This method creates and captures a dragevent from the element.
   */
  async drag(
    this: ElementHandle<Element>,
    target: Point
  ): Promise<Protocol.Input.DragData>;
  async drag(this: ElementHandle<Element>): Promise<Protocol.Input.DragData> {
    throw new Error('Not implemented');
  }

  /**
   * This method creates a `dragenter` event on the element.
   */
  async dragEnter(
    this: ElementHandle<Element>,
    data?: Protocol.Input.DragData
  ): Promise<void>;
  async dragEnter(this: ElementHandle<Element>): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * This method creates a `dragover` event on the element.
   */
  async dragOver(
    this: ElementHandle<Element>,
    data?: Protocol.Input.DragData
  ): Promise<void>;
  async dragOver(this: ElementHandle<Element>): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * This method triggers a drop on the element.
   */
  async drop(
    this: ElementHandle<Element>,
    data?: Protocol.Input.DragData
  ): Promise<void>;
  async drop(this: ElementHandle<Element>): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * This method triggers a dragenter, dragover, and drop on the element.
   */
  async dragAndDrop(
    this: ElementHandle<Element>,
    target: ElementHandle<Node>,
    options?: {delay: number}
  ): Promise<void>;
  async dragAndDrop(this: ElementHandle<Element>): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Triggers a `change` and `input` event once all the provided options have been
   * selected. If there's no `<select>` element matching `selector`, the method
   * throws an error.
   *
   * @example
   *
   * ```ts
   * handle.select('blue'); // single selection
   * handle.select('red', 'green', 'blue'); // multiple selections
   * ```
   *
   * @param values - Values of options to select. If the `<select>` has the
   * `multiple` attribute, all values are considered, otherwise only the first
   * one is taken into account.
   */
  async select(...values: string[]): Promise<string[]> {
    for (const value of values) {
      assert(
        isString(value),
        'Values must be strings. Found value "' +
          value +
          '" of type "' +
          typeof value +
          '"'
      );
    }

    return this.evaluate((element, vals): string[] => {
      const values = new Set(vals);
      if (!(element instanceof HTMLSelectElement)) {
        throw new Error('Element is not a <select> element.');
      }

      const selectedValues = new Set<string>();
      if (!element.multiple) {
        for (const option of element.options) {
          option.selected = false;
        }
        for (const option of element.options) {
          if (values.has(option.value)) {
            option.selected = true;
            selectedValues.add(option.value);
            break;
          }
        }
      } else {
        for (const option of element.options) {
          option.selected = values.has(option.value);
          if (option.selected) {
            selectedValues.add(option.value);
          }
        }
      }
      element.dispatchEvent(new Event('input', {bubbles: true}));
      element.dispatchEvent(new Event('change', {bubbles: true}));
      return [...selectedValues.values()];
    }, values);
  }

  /**
   * Sets the value of an
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input | input element}
   * to the given file paths.
   *
   * @remarks This will not validate whether the file paths exists. Also, if a
   * path is relative, then it is resolved against the
   * {@link https://nodejs.org/api/process.html#process_process_cwd | current working directory}.
   * For locals script connecting to remote chrome environments, paths must be
   * absolute.
   */
  async uploadFile(
    this: ElementHandle<HTMLInputElement>,
    ...paths: string[]
  ): Promise<void>;
  async uploadFile(this: ElementHandle<HTMLInputElement>): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * This method scrolls element into view if needed, and then uses
   * {@link Touchscreen.tap} to tap in the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  async tap(this: ElementHandle<Element>): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    const {x, y} = await this.clickablePoint();
    await this.frame.page().touchscreen.touchStart(x, y);
    await this.frame.page().touchscreen.touchEnd();
  }

  async touchStart(this: ElementHandle<Element>): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    const {x, y} = await this.clickablePoint();
    await this.frame.page().touchscreen.touchStart(x, y);
  }

  async touchMove(this: ElementHandle<Element>): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    const {x, y} = await this.clickablePoint();
    await this.frame.page().touchscreen.touchMove(x, y);
  }

  async touchEnd(this: ElementHandle<Element>): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    await this.frame.page().touchscreen.touchEnd();
  }

  /**
   * Calls {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus | focus} on the element.
   */
  async focus(): Promise<void> {
    await this.evaluate(element => {
      if (!(element instanceof HTMLElement)) {
        throw new Error('Cannot focus non-HTMLElement');
      }
      return element.focus();
    });
  }

  /**
   * Focuses the element, and then sends a `keydown`, `keypress`/`input`, and
   * `keyup` event for each character in the text.
   *
   * To press a special key, like `Control` or `ArrowDown`,
   * use {@link ElementHandle.press}.
   *
   * @example
   *
   * ```ts
   * await elementHandle.type('Hello'); // Types instantly
   * await elementHandle.type('World', {delay: 100}); // Types slower, like a user
   * ```
   *
   * @example
   * An example of typing into a text field and then submitting the form:
   *
   * ```ts
   * const elementHandle = await page.$('input');
   * await elementHandle.type('some text');
   * await elementHandle.press('Enter');
   * ```
   *
   * @param options - Delay in milliseconds. Defaults to 0.
   */
  async type(
    text: string,
    options?: Readonly<KeyboardTypeOptions>
  ): Promise<void> {
    await this.focus();
    await this.frame.page().keyboard.type(text, options);
  }

  /**
   * Focuses the element, and then uses {@link Keyboard.down} and {@link Keyboard.up}.
   *
   * @remarks
   * If `key` is a single character and no modifier keys besides `Shift`
   * are being held down, a `keypress`/`input` event will also be generated.
   * The `text` option can be specified to force an input event to be generated.
   *
   * **NOTE** Modifier keys DO affect `elementHandle.press`. Holding down `Shift`
   * will type the text in upper case.
   *
   * @param key - Name of key to press, such as `ArrowLeft`.
   * See {@link KeyInput} for a list of all key names.
   */
  async press(
    key: KeyInput,
    options?: Readonly<KeyPressOptions>
  ): Promise<void> {
    await this.focus();
    await this.frame.page().keyboard.press(key, options);
  }

  async #clickableBox(): Promise<BoundingBox | null> {
    const boxes = await this.evaluate(element => {
      if (!(element instanceof Element)) {
        return null;
      }
      return [...element.getClientRects()].map(rect => {
        return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
      });
    });
    if (!boxes?.length) {
      return null;
    }
    await this.#intersectBoundingBoxesWithFrame(boxes);
    let frame = this.frame;
    let parentFrame: Frame | null | undefined;
    while ((parentFrame = frame?.parentFrame())) {
      using handle = await frame.frameElement();
      if (!handle) {
        throw new Error('Unsupported frame type');
      }
      const parentBox = await handle.evaluate(element => {
        // Element is not visible.
        if (element.getClientRects().length === 0) {
          return null;
        }
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return {
          left:
            rect.left +
            parseInt(style.paddingLeft, 10) +
            parseInt(style.borderLeftWidth, 10),
          top:
            rect.top +
            parseInt(style.paddingTop, 10) +
            parseInt(style.borderTopWidth, 10),
        };
      });
      if (!parentBox) {
        return null;
      }
      for (const box of boxes) {
        box.x += parentBox.left;
        box.y += parentBox.top;
      }
      await handle.#intersectBoundingBoxesWithFrame(boxes);
      frame = parentFrame;
    }
    const box = boxes.find(box => {
      return box.width >= 1 && box.height >= 1;
    });
    if (!box) {
      return null;
    }
    return {
      x: box.x,
      y: box.y,
      height: box.height,
      width: box.width,
    };
  }

  async #intersectBoundingBoxesWithFrame(boxes: BoundingBox[]) {
    const {documentWidth, documentHeight} = await this.frame
      .isolatedRealm()
      .evaluate(() => {
        return {
          documentWidth: document.documentElement.clientWidth,
          documentHeight: document.documentElement.clientHeight,
        };
      });
    for (const box of boxes) {
      intersectBoundingBox(box, documentWidth, documentHeight);
    }
  }

  /**
   * This method returns the bounding box of the element (relative to the main frame),
   * or `null` if the element is not visible.
   */
  async boundingBox(): Promise<BoundingBox | null> {
    using adoptedThis = await this.frame.isolatedRealm().adoptHandle(this);
    const box = await adoptedThis.evaluate(element => {
      if (!(element instanceof Element)) {
        return null;
      }
      // Element is not visible.
      if (element.getClientRects().length === 0) {
        return null;
      }
      const rect = element.getBoundingClientRect();
      return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
    });
    if (!box) {
      return null;
    }
    const offset = await adoptedThis.#getTopLeftCornerOfFrame();
    if (!offset) {
      return null;
    }
    return {
      x: box.x + offset.x,
      y: box.y + offset.y,
      height: box.height,
      width: box.width,
    };
  }

  /**
   * This method returns boxes of the element, or `null` if the element is not visible.
   *
   * @remarks
   *
   * Boxes are represented as an array of points;
   * Each Point is an object `{x, y}`. Box points are sorted clock-wise.
   */
  async boxModel(): Promise<BoxModel | null> {
    const model = await (async () => {
      using adoptedThis = await this.frame.isolatedRealm().adoptHandle(this);
      return await adoptedThis.evaluate(element => {
        if (!(element instanceof Element)) {
          return null;
        }
        // Element is not visible.
        if (element.getClientRects().length === 0) {
          return null;
        }
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const offsets = {
          padding: {
            left: parseInt(style.paddingLeft, 10),
            top: parseInt(style.paddingTop, 10),
            right: parseInt(style.paddingRight, 10),
            bottom: parseInt(style.paddingBottom, 10),
          },
          margin: {
            left: -parseInt(style.marginLeft, 10),
            top: -parseInt(style.marginTop, 10),
            right: -parseInt(style.marginRight, 10),
            bottom: -parseInt(style.marginBottom, 10),
          },
          border: {
            left: parseInt(style.borderLeft, 10),
            top: parseInt(style.borderTop, 10),
            right: parseInt(style.borderRight, 10),
            bottom: parseInt(style.borderBottom, 10),
          },
        };
        const border: Quad = [
          {x: rect.left, y: rect.top},
          {x: rect.left + rect.width, y: rect.top},
          {x: rect.left + rect.width, y: rect.top + rect.bottom},
          {x: rect.left, y: rect.top + rect.bottom},
        ];
        const padding = transformQuadWithOffsets(border, offsets.border);
        const content = transformQuadWithOffsets(padding, offsets.padding);
        const margin = transformQuadWithOffsets(border, offsets.margin);
        return {
          content,
          padding,
          border,
          margin,
          width: rect.width,
          height: rect.height,
        };

        function transformQuadWithOffsets(
          quad: Quad,
          offsets: {top: number; left: number; right: number; bottom: number}
        ): Quad {
          return [
            {
              x: quad[0].x + offsets.left,
              y: quad[0].y + offsets.top,
            },
            {
              x: quad[1].x - offsets.right,
              y: quad[1].y + offsets.top,
            },
            {
              x: quad[2].x - offsets.right,
              y: quad[2].y - offsets.bottom,
            },
            {
              x: quad[3].x + offsets.left,
              y: quad[3].y - offsets.bottom,
            },
          ];
        }
      });
    })();
    if (!model) {
      return null;
    }
    const offset = await this.#getTopLeftCornerOfFrame();
    if (!offset) {
      return null;
    }
    for (const attribute of [
      'content',
      'padding',
      'border',
      'margin',
    ] as const) {
      for (const point of model[attribute]) {
        point.x += offset.x;
        point.y += offset.y;
      }
    }
    return model;
  }

  async #getTopLeftCornerOfFrame() {
    const point = {x: 0, y: 0};
    let frame = this.frame;
    let parentFrame: Frame | null | undefined;
    while ((parentFrame = frame?.parentFrame())) {
      using handle = await frame.frameElement();
      if (!handle) {
        throw new Error('Unsupported frame type');
      }
      const parentBox = await handle.evaluate(element => {
        // Element is not visible.
        if (element.getClientRects().length === 0) {
          return null;
        }
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return {
          left:
            rect.left +
            parseInt(style.paddingLeft, 10) +
            parseInt(style.borderLeftWidth, 10),
          top:
            rect.top +
            parseInt(style.paddingTop, 10) +
            parseInt(style.borderTopWidth, 10),
        };
      });
      if (!parentBox) {
        return null;
      }
      point.x += parentBox.left;
      point.y += parentBox.top;
      frame = parentFrame;
    }
    return point;
  }

  /**
   * This method scrolls element into view if needed, and then uses
   * {@link Page.(screenshot:3) } to take a screenshot of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  async screenshot(
    this: ElementHandle<Element>,
    options?: ScreenshotOptions
  ): Promise<string | Buffer>;
  async screenshot(this: ElementHandle<Element>): Promise<string | Buffer> {
    throw new Error('Not implemented');
  }

  /**
   * @internal
   */
  protected async assertConnectedElement(): Promise<void> {
    const error = await this.evaluate(async element => {
      if (!element.isConnected) {
        return 'Node is detached from document';
      }
      if (element.nodeType !== Node.ELEMENT_NODE) {
        return 'Node is not of type HTMLElement';
      }
      return;
    });

    if (error) {
      throw new Error(error);
    }
  }

  /**
   * @internal
   */
  protected async scrollIntoViewIfNeeded(
    this: ElementHandle<Element>
  ): Promise<void> {
    if (
      await this.isIntersectingViewport({
        threshold: 1,
      })
    ) {
      return;
    }
    await this.scrollIntoView();
  }

  /**
   * Resolves to true if the element is visible in the current viewport. If an
   * element is an SVG, we check if the svg owner element is in the viewport
   * instead. See https://crbug.com/963246.
   *
   * @param options - Threshold for the intersection between 0 (no intersection) and 1
   * (full intersection). Defaults to 1.
   */
  async isIntersectingViewport(
    this: ElementHandle<Element>,
    options: {
      threshold?: number;
    } = {}
  ): Promise<boolean> {
    await this.assertConnectedElement();
    // eslint-disable-next-line rulesdir/use-using -- Returns `this`.
    const handle = await this.#asSVGElementHandle();
    using target = handle && (await handle.#getOwnerSVGElement());
    return await ((target ?? this) as ElementHandle<Element>).evaluate(
      async (element, threshold) => {
        const visibleRatio = await new Promise<number>(resolve => {
          const observer = new IntersectionObserver(entries => {
            resolve(entries[0]!.intersectionRatio);
            observer.disconnect();
          });
          observer.observe(element);
        });
        return threshold === 1 ? visibleRatio === 1 : visibleRatio > threshold;
      },
      options.threshold ?? 0
    );
  }

  /**
   * Scrolls the element into view using either the automation protocol client
   * or by calling element.scrollIntoView.
   */
  async scrollIntoView(this: ElementHandle<Element>): Promise<void> {
    using adoptedThis = await this.frame.isolatedRealm().adoptHandle(this);
    await adoptedThis.assertConnectedElement();
    await adoptedThis.evaluate(async (element): Promise<void> => {
      element.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'instant',
      });
    });
  }

  /**
   * Returns true if an element is an SVGElement (included svg, path, rect
   * etc.).
   */
  async #asSVGElementHandle(
    this: ElementHandle<Element>
  ): Promise<ElementHandle<SVGElement> | null> {
    if (
      await this.evaluate(element => {
        return element instanceof SVGElement;
      })
    ) {
      return this as ElementHandle<SVGElement>;
    } else {
      return null;
    }
  }

  async #getOwnerSVGElement(
    this: ElementHandle<SVGElement>
  ): Promise<ElementHandle<SVGSVGElement>> {
    // SVGSVGElement.ownerSVGElement === null.
    return await this.evaluateHandle(element => {
      if (element instanceof SVGSVGElement) {
        return element;
      }
      return element.ownerSVGElement!;
    });
  }

  /**
   * If the element is a form input, you can use {@link ElementHandle.autofill}
   * to test if the form is compatible with the browser's autofill
   * implementation. Throws an error if the form cannot be autofilled.
   *
   * @remarks
   *
   * Currently, Puppeteer supports auto-filling credit card information only and
   * in Chrome in the new headless and headful modes only.
   *
   * ```ts
   * // Select an input on the credit card form.
   * const name = await page.waitForSelector('form #name');
   * // Trigger autofill with the desired data.
   * await name.autofill({
   *   creditCard: {
   *     number: '4444444444444444',
   *     name: 'John Smith',
   *     expiryMonth: '01',
   *     expiryYear: '2030',
   *     cvc: '123',
   *   },
   * });
   * ```
   */
  abstract autofill(data: AutofillData): Promise<void>;
}

/**
 * @public
 */
export interface AutofillData {
  creditCard: {
    // See https://chromedevtools.github.io/devtools-protocol/tot/Autofill/#type-CreditCard.
    number: string;
    name: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
  };
}

function intersectBoundingBox(
  box: BoundingBox,
  width: number,
  height: number
): void {
  box.width = Math.max(
    box.x >= 0
      ? Math.min(width - box.x, box.width)
      : Math.min(width, box.width + box.x),
    0
  );
  box.height = Math.max(
    box.y >= 0
      ? Math.min(height - box.y, box.height)
      : Math.min(height, box.height + box.y),
    0
  );
}
