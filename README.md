
  <p align="center">
   <img style="max-width: 400px;" src="https://github.com/Draigan/snake/blob/main/snake.gif" width="320" />
</p>


# Classic Snake Game

- Move with the arrow keys
- Get huge!
- [Play it now](https://draigan1.gitlab.io/portfolio/projects.html)

## Installation
- Add build/snake.js to your project.
- Add build/snake.css to your probject.
- In your html create a div with the id "snake"
  
## Development
#### Install Typescript
```bash
npm install -g typescript
```
#### Install sass
```bash
npm install -g sass
```
#### Compile Typescript
```bash
tsc snake.ts snake.js
```
#### Compile sass
```bash
sass snake.sass snake.css
```
#### Your html should look something like this
```html
<head>
  <link href="snake.css" rel="stylesheet">
  <script src="./snake.js" defer></script>
</head>
<body>
  <div id="snake"></div>
</body>
```
