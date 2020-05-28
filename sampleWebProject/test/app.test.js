const assert = require('assert');

it('has a text input', async () => {
  const dom = await render('index.html');
  const input = dom.window.document.querySelector('input');
  
    assert(input);

});

it('shows a success message for a valid email', async () => {
    const dom = await render('index.html');
    const input = dom.window.document.querySelector('input');

    input.value = 'abc@efg.com';
    dom.window.document
      .querySelector('form')
      .dispatchEvent(new dom.window.Event('submit'));
    const h1 = dom.window.document.querySelector('h1');

    assert.strictEqual(h1.innerHTML, 'Looks good!');
});

it('shows a fail message for an invalid email', async () => {
    const dom = await render('index.html');
    const input = dom.window.document.querySelector('input');

    input.value = 'asdfg';
    dom.window.document
      .querySelector('form')
      .dispatchEvent(new dom.window.Event('submit'));
    const h1 = dom.window.document.querySelector('h1');

    assert.strictEqual(h1.innerHTML, 'Invalid email');
});
