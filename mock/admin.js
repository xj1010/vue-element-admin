const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@first',
    email: '@email',
    mobile: '@integer(11)',
    'status|1': [0, 1],
    last_login_time: '@datetime',
    login_num: '@integer(1,100)',
    created_at: '@datetime'
  }))
}

module.exports = [
  {
    url: '/admin/list',
    type: 'get',
    response: config => {
      const { username, status,  page = 1, limit = 20 } = config.query

      let mockList = List.filter(item => {
        if (username && item.name !== username) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 1000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },


  {
    url: '/admin/create',
    type: 'post',
    response: _ => {
      return {
        code: 1000,
        data: 'success'
      }
    }
  },
  {
    url: '/admin/update',
    type: 'post',
    response: _ => {
      return {
        code: 1000,
        data: 'success'
      }
    }
  },
  {
    url: '/menu/list',
    type: 'get',
    response: config => {
      return {
        code: 1000,
        data: {
          total: 0,
          items: [],
          tree : [
            { id:1, pId:0, name:"随意勾选 1", open:true},
            { id:11, pId:1, name:"随意勾选 1-1", open:true},
            { id:111, pId:11, name:"随意勾选 1-1-1"},
            { id:112, pId:11, name:"随意勾选 1-1-2"},
            { id:12, pId:1, name:"随意勾选 1-2", open:true},
            { id:121, pId:12, name:"随意勾选 1-2-1"},
            { id:122, pId:12, name:"随意勾选 1-2-2"},
            { id:2, pId:0, name:"随意勾选 2", checked:true, open:true},
            { id:21, pId:2, name:"随意勾选 2-1"},
            { id:22, pId:2, name:"随意勾选 2-2", open:true},
            { id:221, pId:22, name:"随意勾选 2-2-1", checked:true},
            { id:222, pId:22, name:"随意勾选 2-2-2"},
            { id:23, pId:2, name:"随意勾选 2-3"}
          ]
        }
      }
    }
  }
]

