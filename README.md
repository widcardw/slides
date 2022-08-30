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
