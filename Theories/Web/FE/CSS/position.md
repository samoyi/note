# position


## sticky
```css
.wrapper {
    height: 200px;
    border: solid;
    margin-bottom: 50px;
}

.wrapper div {
    border: 1px solid;
    height: 40px;
}

.sticky {
  position: sticky;
  top: -1px;
}
```
```html
<div class="wrapper">
    <h2>wrapper1</h2>
    <div class="sticky">sticky</div>
</div>
<div class="wrapper">
    <h2>wrapper2</h2>
    <div class="sticky">sticky</div>
</div>
<div class="wrapper">
    <h2>wrapper3</h2>
    <div class="sticky">sticky</div>
</div>
<div class="wrapper">
    <h2>wrapper4</h2>
    <div class="sticky">sticky</div>
</div>
<div class="wrapper">
    <h2>wrapper5</h2>
    <div class="sticky">sticky</div>
</div>
<div class="wrapper">
    <h2>wrapper6</h2>
    <div class="sticky">sticky</div>
</div>

```