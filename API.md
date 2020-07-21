## API文档

>### 登录

【URL】 [http://localhost:3000/api/login](http://localhost:3000/api/login "http://localhost:3000/api/login")

【请求方式】 `POST`

【请求数据】
```
{
  username: 'xialei',
  password: '123456'
}
```

【登录成功返回数据】
```
{
  code: 0,
  data: {
    msg: '登录成功'
  }
}
```

【登录失败返回数据】
```
{
  code: 1,
  data: {
    msg: '用户名或密码错误',
    token: 'fdsafsafsdafsafdsa'
  }
}
```

>### 注册

【URL】 [http://localhost:3000/api/register](http://localhost:3000/api/register "http://localhost:3000/api/register")

【请求方式】 `POST`

【请求数据】
```
{
  username: 'xialei',
  password: '123456',
  email: '2278768767@163.com'
}
```

【注册成功返回数据】
```
{
  code: 0,
  data: {
    msg: '注册成功',
    token: 'fdsfsfsdfdsfsfs'
  }
}
```

【注册失败返回数据】
```
{
  code: 1,
  data: {
    msg: '用户名重复'
  }
}
```

>### 查看是否存在该用户名

【URL】 [http://localhost:3000/api/verify/:username](http://localhost:3000/api/verify/:username "http://localhost:3000/api/verify/:username")

【请求方式】 `GET`

【返回数据】
```
{
  code: 0,
  data: {
    username: 'xialei'
  }
}
```

【获取数据失败返回数据】
```
{
  code: 1,
  data: {
    msg: '错误'
  }
}
```

>### 获取全部用户

【URL】 [http://localhost:3000/api/rest/users](http://localhost:3000/api/rest/users "http://localhost:3000/api/rest/users")

【请求方式】 `GET`

【请求参数】
```
{
  page: 1,
  limit: 10,
  username: 'xia'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '获取用户成功',
    total: 100,
    users: [
      {
        _id: '5dds997f99we9e',
        username: 'xialei',
        email: '22278979@163.com',
        roleId: '568deee898d',
        isValid: true
      }
    ]
  }
}
```

【获取数据失败返回数据】
```
{
  code: 1,
  msg: '数据或服务器错误'
}
```

>### 更新用户信息

【URL】 [http://localhost:3000/api/rest/users](http://localhost:3000/api/rest/users "http://localhost:3000/api/rest/users")

【请求方式】 `PUT`

【请求数据】
```
{
  _id: '5ddessdee',
  username: 'xialei'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '用户信息更新成功'
  }
}
```

【更新数据失败返回数据】
```
{
  code: 1,
  msg: '数据或服务器错误'
}
```

>### 获取目录

【URL】 [http://localhost:3000/api/rest/categories](http://localhost:3000/api/rest/categories "http://localhost:3000/api/rest/categories")

【请求方式】 `GET`

【请求数据】
```
{
  parentId: '212121221'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '获取目录成功',
    categories: [
      {
        _id: '12121',
        name: 'JavaScript',
        desc: 'dsfsafsfdsafdsaffdsa'
      }
    ]
  }
}
```

【更新数据失败返回数据】
```
{
  code: 1,
  msg: '数据或服务器错误'
}
```

>### 更新目录

【URL】 [http://localhost:3000/api/rest/categories](http://localhost:3000/api/rest/categories "http://localhost:3000/api/rest/categories")

【请求方式】 `GET`

【请求数据】
```
{
  _id: '212121221',
  name: 'JavaScript',
  parent: 'fdsffsfdsfs',
  desc: 'fdsafdsagdsafdsagdagdsa'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '更新目录成功'
  }
}
```

【更新数据失败返回数据】
```
{
  code: 1,
  msg: '数据或服务器错误'
}
```

>### 删除目录

【URL】 [http://localhost:3000/api/rest/categories/:id](http://localhost:3000/api/rest/categories/:id "http://localhost:3000/api/rest/categories/:id")

【请求方式】 `DELETE`

【请求数据】
```
{
  _id: '212121221'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '目录删除成功'
  }
}
```

【删除目录失败返回数据】
```
{
  code: 1,
  msg: '目录已有文章或子目录'
}
```

>### 增加目录

【URL】 [http://localhost:3000/api/rest/categories/](http://localhost:3000/api/rest/categories/ "http://localhost:3000/api/rest/categories/")

【请求方式】 `POST`

【请求数据】
```
{
  name: 'CSS',
  desc: 'CSS的艺术',
  parent: 'fdsfsdfsdfs'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '目录增加成功'
  }
}
```

【删除目录失败返回数据】
```
{
  code: 1,
  msg: '服务器出错，请刷新后重试'
}
```

>### 查询文章

【URL】 [http://localhost:3000/api/rest/articles/](http://localhost:3000/api/rest/articles/ "http://localhost:3000/api/rest/articles/")

【请求方式】 `GET`

【请求数据】
```
{
  name: 'Javascript基础',
  desc: 'Java',
  categories: ['fdfsfsf', '21323232']
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '文章查询成功',
  articles: [
    {
      _id: '12323232',
      desc: 'fdsafdgagd',
      title: '标题',
      createAt: '322312323',
      updateAt: '32323232323',
      Author: 'xialei',
      isPublish: false
    }
  ]
  }
}
```

【删除目录失败返回数据】
```
{
  code: 1,
  msg: '服务器出错，请刷新后重试'
}
```

>### 编辑文章

【URL】 [http://localhost:3000/api/rest/articles/:id](http://localhost:3000/api/rest/articles/:id "http://localhost:3000/api/rest/articles/:id")

【请求方式】 `PUT`

【请求数据】
```
{
  id: '122121212'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '文章更新成功'
  }
}
```

【编辑文章失败返回数据】
```
{
  code: 1,
  msg: '服务器出错，请刷新后重试'
}
```

>### 增加文章

【URL】 [http://localhost:3000/api/rest/articles](http://localhost:3000/api/rest/articles "http://localhost:3000/api/rest/articles")

【请求方式】 `POST`

【请求数据】
```
{
  title: 'JavaScript基础',
  desc: 'Javascript基础是重要的',
  author: '4343434',
  content: 'fdsfdsfsdfsdfsdfdsfsfsfsfs'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '文章添加成功'
  }
}
```

【添加文章失败返回数据】
```
{
  code: 1,
  msg: '服务器出错，请刷新后重试'
}
```

>### 增加文章

【URL】 [http://localhost:3000/api/rest/articles/:id](http://localhost:3000/api/rest/articles/:id "http://localhost:3000/api/rest/articles/:id")

【请求方式】 `DELETE`

【请求数据】
```
{
  id: '1212123232'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '文章删除成功'
  }
}
```

【删除文章失败返回数据】
```
{
  code: 1,
  msg: '服务器出错，请刷新后重试'
}
```

>### 增加角色

【URL】 [http://localhost:3000/api/rest/roles](http://localhost:3000/api/rest/roles "http://localhost:3000/api/rest/roles")

【请求方式】 `POST`

【请求数据】
```
{
  name: '游客',
  permissions: ['1232323','23323232']
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '角色添加成功'
  }
}
```

【增加角色失败返回数据】
```
{
  code: 1,
  msg: '服务器出错，请刷新后重试'
}
```

>### 更新角色

【URL】 [http://localhost:3000/api/rest/roles](http://localhost:3000/api/rest/roles "http://localhost:3000/api/rest/roles")

【请求方式】 `PUT`

【请求数据】
```
{
  _id: '123232',
  name: '游客',
  permissions: ['1232323','23323232']
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '角色更新成功'
  }
}
```

【更新角色失败返回数据】
```
{
  code: 1,
  msg: '服务器出错，请刷新后重试'
}
```

>### 删除角色

【URL】 [http://localhost:3000/api/rest/roles/:id](http://localhost:3000/api/rest/roles/:id "http://localhost:3000/api/rest/roles/:id")

【请求方式】 `DELETE`

【请求数据】
```
{
  id: '1212121'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '角色删除'
  }
}
```

【增加角色失败返回数据】
```
{
  code: 1,
  msg: '角色已被使用，不能删除'
}
```

>### 查询角色

【URL】 [http://localhost:3000/api/rest/roles](http://localhost:3000/api/rest/roles "http://localhost:3000/api/rest/roles")

【请求方式】 `GET`

【请求数据】
```
{
  name: '游客'
}
```

【返回数据】
```
{
  code: 0,
  data: {
    msg: '角色查询成功',
  roles: [
    {
      _id: '1212121',
      name: '游客',
      permissions: ['fsfsfsdfsf']
    }
  ]
  }
}
```

【查询角色失败返回数据】
```
{
  code: 1,
  msg: '服务器出错，请刷新后重试'
}
```