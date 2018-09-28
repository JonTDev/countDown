# Count Down
I needed to create a timer that would be able to be controlled at any time.
The Class here adds and displays if needed.  There are no dependencies and
it should work on every browser old and new.

## Install
Just load the file like you would any other JavaScript file.
```
<script src="path/to/count-down.js"></script>
```

## Use
```
let timer = new CountDown();

// You can use a selector, HTML Element, or jQuery Object.
// It is completely optional and not needed to make work.
timer.setDisplay('#displayTimer');



// All methods that are not callbacks are chainable.
// Some methods have both like the addMinute when a
// call back is not used it chains.
timer
  .setFormat('H:M:S')
  .addMinute(1)
  start(() => {
    console.log('Times Up');
});

setTimeout(() => {
  // Just an example that the time is added as it counts down.
  timer.addSeconds(5)
}, 5000);
```

[CodePen](https://codepen.io/ShellVII/pen/EdaaXR)
