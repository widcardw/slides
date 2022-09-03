# Welcome to [Slidev](https://github.com/slidevjs/slidev)!

To start the slide show:

- `npm install`
- `npm run dev`
- visit http://localhost:3030

Edit the [slides.md](./slides.md) to see the changes.

Learn more about Slidev on [documentations](https://sli.dev/).

## 部署

> 我无语了，我竟然能做到手动部署这种事情，日

1. 运行命令

    ```shell
    pnpm run build path/to/slides.md --base path/to
    ```

2. 把 _path/to/dist_ 文件夹拖动到根目录下的 _dist/path_ 目录下，并把 _dist_ 重命名为 _to_

3. 把整个 _dist_ 文件夹拖到 Netlify 中

## 静态资源编译

按照 slidev 官方文档，可以使用下面的方式来引入静态资源

```markdown
![pic](/pic.png)
```

```html
<img src="/pic.png">
```

其中，所有的图片都放在 _public_ 文件夹下。

然而，在 build 的时候会出一点小问题：当目标 slides 文件不在根目录，rollup 会找不到这些资源，因此需要将
slides 文件放在根目录，备份已经编译好的 _dist_，使用命令 build

```shell
pnpm run build --base path/to
```

然后把编译完成的 _dist_ 放到原本应该放在的地方，并更改文件夹名称

最后，把移出来的 slides 文件放回原处
