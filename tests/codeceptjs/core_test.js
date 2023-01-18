/* global Feature Scenario */

var assert = require('assert')
const { DEFAULT_WAIT_TIME } = require('./test-config')

Feature('core')

Scenario('should set per-editor options @per-editor-options', async (I) => {
  I.amOnPage('per-editor-options.html')
  I.waitForElement('.je-ready')
  I.waitForElement('[title="Expand"]')
  I.dontSeeElement('[title="Collapse"]')
  I.dontSeeElement('.card')
})

Scenario('should set container attributes @container-attributes', async (I) => {
  I.amOnPage('container-attributes.html')
  I.waitForElement('.je-ready')
  I.waitForElement('.container-class')
  I.dontSeeElement('[data-schematype="blank"]')
  I.dontSeeElement('[data-schemapath="blank"]')
  I.dontSeeElement('[data-schemaid="blank"]')
})

Scenario('should not set inputs name attributes @use-name-attributes', async (I) => {
  I.amOnPage('use-name-attributes.html')
  I.waitForElement('.je-ready')
  I.dontSeeElement('[name]')
})

Scenario('should have class je-ready when ready @core @ready', async (I) => {
  I.amOnPage('ready.html')
  I.waitForElement('.je-ready')
})

Scenario('should Disable and enable entire form', async (I) => {
  I.amOnPage('core.html')
  I.seeElement('[data-schemapath="root.name"] input')
  I.seeElement('[data-schemapath="root.age"] input')
  I.click('disable')
  I.seeElement('[data-schemapath="root.age"] input:disabled')
  I.seeElement('[data-schemapath="root.name"] input:disabled')
  I.click('enable')
  I.seeElement('[data-schemapath="root.age"] input:not(:disabled)')
  I.seeElement('[data-schemapath="root.name"] input:not(:disabled)')
})

Scenario('should Disable and enable part of the form', async (I) => {
  I.amOnPage('core.html')
  I.seeElement('[data-schemapath="root.name"] input')
  I.seeElement('[data-schemapath="root.age"] input')
  I.click('disable part')
  I.seeElement('[data-schemapath="root.name"] input:disabled')
  I.click('enable part')
  I.seeElement('[data-schemapath="root.name"] input:not(:disabled)')
})

Scenario('should destroy', async (I) => {
  I.amOnPage('core.html')
  I.seeElement('[data-schemapath="root"]')
  I.click('destroy')
  I.dontSeeElement('[data-schemapath="root"]')
})

Scenario('should set and get form value', async (I) => {
  I.amOnPage('core.html')
  I.click('.get-value')
  assert.equal(await I.grabValueFrom('.value'), '{"age":18,"name":"Francesco Avizzano"}')
  I.click('.set-value')
  I.click('.get-value')
  assert.equal(await I.grabValueFrom('.value'), '{"age":40,"name":"John Smith"}')
})

Scenario('should set and get individual values', async (I) => {
  I.amOnPage('core.html')
  I.click('.get-individual-value')
  assert.equal(await I.grabValueFrom('.value'), '"Francesco Avizzano"')
  I.click('.set-individual-value')
  assert.equal(await I.grabValueFrom('.value'), '"john kaminski"')
})

Scenario('should watch a specific field for changes', async (I) => {
  I.amOnPage('core.html')
  I.dontSeeElement('.name-changed')
  I.click('.set-individual-value')
  I.seeElement('.name-changed')
})

Scenario('should watch form for changes', async (I) => {
  I.amOnPage('core.html')
  I.dontSeeElement('.form-changed')
  I.click('.set-value')
  I.seeElement('.form-changed')
})

Scenario('should change the form if form_name_root option is set @core', async (I) => {
  I.amOnPage('form-name.html')
  I.see('Property must be set.', '.invalid-feedback')
  I.seeElement('[data-schemapath="form_1"]')
  I.seeElement('[data-schemapath="form_2"]')
  I.seeElement('[name="form_1"]')
  I.seeElement('[name="form_2"]')
  I.seeElement('[id="form_1[0]"]')
  I.seeElement('[id="form_1[1]"]')
  I.seeElement('[id="form_1[2]"]')
  I.seeElement('[id="form_2[0]"]')
  I.seeElement('[id="form_2[1]"]')
  I.seeElement('[id="form_2[2]"]')
  I.seeElement('[for="form_1[0]"]')
  I.seeElement('[for="form_1[1]"]')
  I.seeElement('[for="form_1[2]"]')
  I.seeElement('[for="form_2[0]"]')
  I.seeElement('[for="form_2[1]"]')
  I.seeElement('[for="form_2[2]"]')
  I.click('[for="form_1[0]"]')
  I.click('[for="form_2[1]"]')
  I.dontSee('Property must be set.', '.invalid-feedback')
  I.click('#get-value-form-1')
  assert.equal(await I.grabValueFrom('#value-form-1'), '"yes"')
  I.click('#get-value-form-2')
  assert.equal(await I.grabValueFrom('#value-form-2'), '"no"')
})

Scenario('should validate against oneOf schemas and display single oneOf and editors error messages @core @oneof', async (I) => {
  I.amOnPage('oneof.html')
  I.waitForElement('.je-ready')
  I.waitForText('Object is missing the required property \'p4\'', DEFAULT_WAIT_TIME, '.alert-danger')
  I.waitForText('Value must validate against exactly one of the provided schemas. It currently validates against 0 of the schemas.', DEFAULT_WAIT_TIME, '.alert-danger')
  I.waitForText('Object is missing the required property \'p1\'', DEFAULT_WAIT_TIME, '.alert-danger')
  I.waitForText('Object is missing the required property \'p2\'', DEFAULT_WAIT_TIME, '.alert-danger')
  I.waitForText('Property must be set.', DEFAULT_WAIT_TIME, '[data-schemapath="root.p4"] .invalid-feedback')
  I.waitForText('Property must be set.', DEFAULT_WAIT_TIME, '[data-schemapath="root.p5.p1"] .invalid-feedback')
  I.waitForText('Property must be set.', DEFAULT_WAIT_TIME, '[data-schemapath="root.p5.p2"] .invalid-feedback')
  I.fillField('root[p4]', 'to')
  I.fillField('root[p5][p1]', 'to')
  I.fillField('root[p5][p2]', 'to')
  I.click('Get Value')
  I.wait(3)
  I.dontSee('Object is missing the required property \'p4\'', '.alert-danger')
  I.dontSee('Object is missing the required property \'p1\'', '.alert-danger')
  I.dontSee('Object is missing the required property \'p2\'', '.alert-danger')
  I.waitForText('Value must be at least 4 characters long.', DEFAULT_WAIT_TIME, '[data-schemapath="root.p4"] .invalid-feedback')
  I.waitForText('Value must be at least 4 characters long.', DEFAULT_WAIT_TIME, '[data-schemapath="root.p5.p1"] .invalid-feedback')
  I.waitForText('Value must be at least 4 characters long.', DEFAULT_WAIT_TIME, '[data-schemapath="root.p5.p2"] .invalid-feedback')
  I.fillField('root[p4]', 'todo')
  I.fillField('root[p5][p1]', 'todo')
  I.fillField('root[p5][p2]', 'todo')
  I.click('Get Value')
  I.wait(3)
  I.dontSee('Value must be at least 4 characters long.', '[data-schemapath="root.p4"] .invalid-feedback')
  I.dontSee('Value must be at least 4 characters long.', '[data-schemapath="root.p5.p1"] .invalid-feedback')
  I.dontSee('Value must be at least 4 characters long.', '[data-schemapath="root.p5.p2"] .invalid-feedback')
})

Scenario('should validate against anyOf schemas and display single anyOf and editors error messages @core @anyof', async (I) => {
  I.amOnPage('anyof.html')
  I.waitForElement('.je-ready')
  I.waitForElement('.alert-danger')
  I.selectOption('.je-switcher', 'Value, number')
  I.waitForElement('.alert-danger')
  I.selectOption('.je-switcher', 'Value, null')
  I.waitForElement('.alert-danger')
  I.selectOption('.je-switcher', 'Value, string')
  I.waitForText('Object is missing the required property \'age\'', DEFAULT_WAIT_TIME, '.alert-danger')
  I.waitForText('Property must be set.', DEFAULT_WAIT_TIME, '[data-schemapath="root.age"] .invalid-feedback')
  I.fillField('root[age]', 'to')
  I.click('Get Value')
  I.wait(3)
  I.dontSee('Object is missing the required property \'age\'', '.alert-danger')
  I.dontSee('Property must be set.', '[data-schemapath="root.age"] .invalid-feedback')
})

Scenario('should display anyOf and oneOf error messages in the correct places @848', async (I) => {
  I.amOnPage('issues/issue-gh-848.html')
  I.selectOption('.je-switcher', 'Value, string')
  I.waitForElement('[data-schemapath="root.list"] .invalid-feedback', DEFAULT_WAIT_TIME)
  I.dontSeeElement('[data-schemapath="root.list_group"] .invalid-feedback', DEFAULT_WAIT_TIME)
})

Scenario('Should switch between all json 7 data types in @oneof and display error messages for each one @core', async (I) => {
  I.amOnPage('oneof-2.html')
  I.waitForElement('.je-ready')

  I.selectOption('.je-switcher', 'Value, string')
  assert.equal(await I.grabValueFrom('#value'), '{"test":""}')
  I.waitForText('Value must validate against exactly one of the provided schemas.')
  I.waitForText('Value must be the constant value')

  I.selectOption('.je-switcher', 'Value, boolean')
  assert.equal(await I.grabValueFrom('#value'), '{"test":false}')
  I.waitForText('Value must validate against exactly one of the provided schemas.')
  I.waitForText('Value must be the constant value')

  I.selectOption('.je-switcher', 'Value, array')
  assert.equal(await I.grabValueFrom('#value'), '{"test":[]}')
  I.waitForText('Value must validate against exactly one of the provided schemas.')
  I.waitForText('Value must be the constant value')

  I.selectOption('.je-switcher', 'Value, object')
  assert.equal(await I.grabValueFrom('#value'), '{"test":{}}')
  I.waitForText('Value must validate against exactly one of the provided schemas.')
  I.waitForText('Value must be the constant value')
  I.waitForText('Object is missing the required property \'test\'')

  I.selectOption('.je-switcher', 'Value, number')
  assert.equal(await I.grabValueFrom('#value'), '{"test":0}')
  I.waitForText('Value must validate against exactly one of the provided schemas.')
  I.waitForText('Value must be the constant value')

  I.selectOption('.je-switcher', 'Value, integer')
  assert.equal(await I.grabValueFrom('#value'), '{"test":0}')
  I.waitForText('Value must validate against exactly one of the provided schemas.')
  I.waitForText('Value must be the constant value')

  I.selectOption('.je-switcher', 'Value, null')
  assert.equal(await I.grabValueFrom('#value'), '{"test":null}')
})

Scenario('Should switch between all json 7 data types in @anyof and display error messages for each one @core', async (I) => {
  I.amOnPage('anyof-2.html')
  I.waitForElement('.je-ready')

  assert.equal(await I.grabValueFrom('#value'), '{"test":""}')
  I.waitForText('Value must validate against at least one of the provided schemas')

  I.selectOption('.je-switcher', 'Value, boolean')
  assert.equal(await I.grabValueFrom('#value'), '{"test":false}')
  I.waitForText('Value must validate against at least one of the provided schemas')

  I.selectOption('.je-switcher', 'Value, array')
  assert.equal(await I.grabValueFrom('#value'), '{"test":[]}')
  I.waitForText('Value must validate against at least one of the provided schemas')

  I.selectOption('.je-switcher', 'Value, object')
  assert.equal(await I.grabValueFrom('#value'), '{"test":{}}')
  I.waitForText('Value must validate against at least one of the provided schemas')

  I.selectOption('.je-switcher', 'Value, number')
  assert.equal(await I.grabValueFrom('#value'), '{"test":0}')
  I.waitForText('Value must validate against at least one of the provided schemas')

  I.selectOption('.je-switcher', 'Value, integer')
  assert.equal(await I.grabValueFrom('#value'), '{"test":0}')
  I.waitForText('Value must validate against at least one of the provided schemas')

  I.selectOption('.je-switcher', 'Value, null')
  assert.equal(await I.grabValueFrom('#value'), '{"test":null}')
})

Scenario('should validate against oneOf schemas and display single oneOf and editors error messages @core @translate-property', async (I) => {
  I.amOnPage('translate-property.html?lang=en')
  I.waitForText('Object Title')
  I.waitForText('Object Description')
  I.waitForText('Boolean Title')
  I.waitForText('Boolean Description')
  I.seeInSource('Boolean Info Text')
  I.waitForText('String Title')
  I.waitForText('String Description')
  I.seeInSource('String Info Text')
  I.waitForText('String Radio Title')
  I.waitForText('String Radio Description')
  I.seeInSource('String Radio Info Text')
  I.waitForText('Integer Title')
  I.waitForText('Integer Description')
  I.seeInSource('Integer Info Text')
  I.waitForText('Number Title')
  I.waitForText('Number Description')
  I.seeInSource('Number Info Text')
  I.waitForText('Array Title')
  I.waitForText('Array Description')
  I.seeInSource('Array Info Text')
  I.waitForText('Array Tabs Title')
  I.waitForText('Array Tabs Description')
  I.seeInSource('Array Tabs Info Text')
  I.waitForText('Array Table Title')
  I.waitForText('Array Table Description')
  I.seeInSource('Array Table Info Text')
  I.waitForText('Signature Title')
  I.waitForText('Signature Description')
  I.seeInSource('Signature Info Text')
  I.waitForText('Rating Title')
  I.waitForText('Rating Description')
  I.seeInSource('Rating Info Text')

  I.amOnPage('translate-property.html?lang=de')
  I.waitForText('Object Title (but in german)')
  I.waitForText('Object Description (but in german)')
  I.waitForText('Boolean Title (but in german)')
  I.waitForText('Boolean Description (but in german)')
  I.seeInSource('Boolean Info Text (but in german)')
  I.waitForText('String Title (but in german)')
  I.waitForText('String Description (but in german)')
  I.seeInSource('String Info Text (but in german)')
  I.waitForText('String Radio Title (but in german)')
  I.waitForText('String Radio Description (but in german)')
  I.seeInSource('String Radio Info Text (but in german)')
  I.waitForText('Integer Title (but in german)')
  I.waitForText('Integer Description (but in german)')
  I.seeInSource('Integer Info Text (but in german)')
  I.waitForText('Number Title (but in german)')
  I.waitForText('Number Description (but in german)')
  I.seeInSource('Number Info Text (but in german)')
  I.waitForText('Array Title (but in german)')
  I.waitForText('Array Description (but in german)')
  I.seeInSource('Array Info Text (but in german)')
  I.waitForText('Array Tabs Title (but in german)')
  I.waitForText('Array Tabs Description (but in german)')
  I.seeInSource('Array Tabs Info Text (but in german)')
  I.waitForText('Array Table Title (but in german)')
  I.waitForText('Array Table Description (but in german)')
  I.seeInSource('Array Table Info Text (but in german)')
  I.waitForText('Signature Title (but in german)')
  I.waitForText('Signature Description (but in german)')
  I.seeInSource('Signature Info Text (but in german)')
  I.waitForText('Rating Title (but in german)')
  I.waitForText('Rating Description (but in german)')
  I.seeInSource('Rating Info Text (but in german)')
})

Scenario('should load internal schema definitions, external schema definitions and external schema properties @core @references', async (I) => {
  I.amOnPage('references.html')
  I.waitForText('References JSON Editor Example')

  // internal schema definitions
  I.waitForElement('[data-schemapath="root.external"]')
  I.waitForElement('[data-schemapath="root.orgid"]')

  // external schema definitions
  I.click('Add Person')
  I.waitForElement('[data-schemapath="root.people.0.name"]')
  I.waitForElement('[data-schemapath="root.people.0.age"]')
  I.waitForElement('[data-schemapath="root.people.0.gender"]')
  I.selectOption('.je-switcher', 'Complex Person')
  I.waitForElement('[data-schemapath="root.people.0.location.city"]')
  I.waitForElement('[data-schemapath="root.people.0.location.state"]')
  I.waitForElement('[data-schemapath="root.people.0.location.citystate"]')

  // external schema properties
  I.waitForElement('[data-schemapath="root.link.street_address"]')

  const currentUrl = await I.grabCurrentUrl()
  const currentPath = currentUrl.replace('references.html', '')

  // Ensures that external schemas were stored in cache. (This does not assert that the loader actually fetched them from cache.)
  const schemaPaths = [
    '../fixtures/string.json',
    '../fixtures/definitions.json',
    '../fixtures/basic_person.json',
    '../fixtures/person.json',
  ]
  for (const path of schemaPaths) {
    let key = 'je-cache::' + currentPath + path;

    const item = await I.executeScript(function (storageKey) {
      return window.localStorage.getItem(storageKey);
    }, key)
    const itemDecoded = JSON.parse(item)
    assert.equal(itemDecoded.cacheBuster, 'abc123');
    assert(itemDecoded, 'Cached schema found');
  }
})

Scenario('should override error messages if specified in schema options @core @errors-messages', async (I) => {
  I.amOnPage('error-messages.html')
  I.waitForText('Error Messages')

  I.waitForText('CUSTOM EN: Value required')
  I.waitForText('CUSTOM EN: Value must be the constant value')
  I.waitForText('CUSTOM EN: Value must be at least 6 characters long')
  I.waitForText('CUSTOM EN: Value must be at most 6 characters long')
  I.waitForText('CUSTOM EN: Value must validate against at least one of the provided schemas')
  I.waitForText('CUSTOM EN: Value must validate against exactly one of the provided schemas. It currently validates against 0 of the schemas')
  I.waitForText('CUSTOM EN: Value must be one of the provided types')
  I.waitForText('CUSTOM EN: Value must not be one of the provided disallowed types')
  I.waitForText('CUSTOM EN: Value must not be of type string')
  I.waitForText('CUSTOM EN: Value must be of type integer')
  I.waitForText('CUSTOM EN: Value must not validate against the provided schema')
  I.waitForText('CUSTOM EN: Date must be greater than 1 January 1970')
  I.waitForText('CUSTOM EN: Value must match the pattern ^[a-zA-Z0-9_]+$')
  I.waitForText('CUSTOM EN: Value must be a multiple of 5')
  I.waitForText('CUSTOM EN: Value must be at least 5')
  I.waitForText('CUSTOM EN: Value must be greater than 5')
  I.waitForText('CUSTOM EN: Value must be less than 10')
  I.waitForText('CUSTOM EN: Value must be less than 15')
  I.waitForText('CUSTOM EN: Object must have at least 1 properties')
  I.waitForText('CUSTOM EN: Object must have at most 1 properties')
  I.waitForText('CUSTOM EN: Object is missing the required property \'name\'')
  I.waitForText('CUSTOM EN: Unsupported propertyName UNSOPPORTED')
  I.waitForText('CUSTOM EN: Property name fullname cannot match invalid pattern')
  I.waitForText('CUSTOM EN: Property name fullname cannot match invalid enum')
  I.waitForText('CUSTOM EN: Property name fullname cannot match invalid maxLength')
  I.waitForText('CUSTOM EN: Property name fullname exceeds maxLength')
  I.waitForText('CUSTOM EN: Property name pets does not match pattern')
  I.waitForText('CUSTOM EN: Property name $pets does not match pattern')
  I.waitForText('CUSTOM EN: Property name pets does not match the const value')
  I.waitForText('CUSTOM EN: Property name pets does not match any enum values')
  I.waitForText('CUSTOM EN: Array must have unique items')

  I.click('Switch to ES')

  I.waitForText('CUSTOM ES: Value required')
  I.waitForText('CUSTOM ES: Value must be the constant value')
  I.waitForText('CUSTOM ES: Value must be at least 6 characters long')
  I.waitForText('CUSTOM ES: Value must be at most 6 characters long')
  I.waitForText('CUSTOM ES: Value must validate against at least one of the provided schemas')
  I.waitForText('CUSTOM ES: Value must validate against exactly one of the provided schemas. It currently validates against 0 of the schemas')
  I.waitForText('CUSTOM ES: Value must be one of the provided types')
  I.waitForText('CUSTOM ES: Value must not be one of the provided disallowed types')
  I.waitForText('CUSTOM ES: Value must not be of type string')
  I.waitForText('CUSTOM ES: Value must be of type integer')
  I.waitForText('CUSTOM ES: Value must not validate against the provided schema')
  I.waitForText('CUSTOM ES: Date must be greater than 1 January 1970')
  I.waitForText('CUSTOM ES: Value must match the pattern ^[a-zA-Z0-9_]+$')
  I.waitForText('CUSTOM ES: Value must be a multiple of 5')
  I.waitForText('CUSTOM ES: Value must be at least 5')
  I.waitForText('CUSTOM ES: Value must be greater than 5')
  I.waitForText('CUSTOM ES: Value must be less than 10')
  I.waitForText('CUSTOM ES: Value must be less than 15')
  I.waitForText('CUSTOM ES: Object must have at least 1 properties')
  I.waitForText('CUSTOM ES: Object must have at most 1 properties')
  I.waitForText('CUSTOM ES: Object is missing the required property \'name\'')
  I.waitForText('CUSTOM ES: Unsupported propertyName UNSOPPORTED')
  I.waitForText('CUSTOM ES: Property name fullname cannot match invalid pattern')
  I.waitForText('CUSTOM ES: Property name fullname cannot match invalid enum')
  I.waitForText('CUSTOM ES: Property name fullname cannot match invalid maxLength')
  I.waitForText('CUSTOM ES: Property name fullname exceeds maxLength')
  I.waitForText('CUSTOM ES: Property name pets does not match pattern')
  I.waitForText('CUSTOM ES: Property name $pets does not match pattern')
  I.waitForText('CUSTOM ES: Property name pets does not match the const value')
  I.waitForText('CUSTOM ES: Property name pets does not match any enum values')
  I.waitForText('CUSTOM ES: Array must have unique items')
})
