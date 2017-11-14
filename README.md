# electron-auto-updater-dome

macOS平台需要用开发者账号签名, 本dome未签名. mac下不能自动更新.


1. 默认的远程更新仓库信息会从 `.git/config` 中获取，如果要修改的化可以修改`package.json`

        {
            ...
            "build": {
                "publish": [{
                    "provider": "github",
                    "owner": "iffy",
                    "repo": "electron-updater-example"
                }],
                ...
            }
        }

2. 创建一个[GitHub access token](https://github.com/settings/tokens/new), 至少勾选 `repo`权限,  然后导出环境变量(on macOS/linux):

        export GH_TOKEN="<YOUR_TOKEN_HERE>"

3. 把当前版本的代码`push`到仓库, 然后打包并把release包推到github release中。本例中的

        publish: build --mac --win --ia32 -p always

4. 现在[github·release](https://github.com/iffy/electron-updater-example/releases)中已经存在刚release的`draft`, 编辑后点击`Publish release`发布.  

5. 更新`package.json`中的version, 重复第`3` & `4`步, `push`. publish最新版本到github

6. 打开低版本, 即开始升级



## 参考资料
[auto-updater](https://www.electron.build/auto-update)

[`publish`](https://github.com/electron-userland/electron-builder/wiki/Publishing-Artifacts#PublishConfiguration)  

[electron-updater-example](https://github.com/iffy/electron-updater-example)
