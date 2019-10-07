# ReqList

Extend your ReSpec enabled technical report with a navigation section that lists the MUSTs and SHOULDs, with links and context.

## Usage

In your spec's HTML `<head>`, you can add the JS and CSS files from this npm published package.

```html
<head>
  <!-- ... -->  
  <script src="https://unpkg.com/reqlist/lib/reqlist.js" class="remove"></script>
  <link href="https://unpkg.com/reqlist/lib/reqlist.css" class="removeOnSave" rel="stylesheet" type="text/css" />
  <!-- ... --> 
</head> 
```

In your ReSpec config, add the `prepare_reqlist` function to the `preProcess` array field, and `add_reqlist_button` to `postProcess`.

```js
var respecConfig = {
  preProcess: [
    prepare_reqlist
  ],
  postProcess: [
    add_reqlist_button
  ],
  // ...
}
```

Load your draft spec with ReSpec in a browser.
Use the button on the top right labeled 'ReqList' to jump to the added 'Requirements List'.
