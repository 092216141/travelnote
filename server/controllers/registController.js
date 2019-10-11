var registerDAO = require('../models/registerDAO')
var formidable = require('formidable')
var bcrypt = require('bcrypt')
var request = require('request');
var querystring = require('querystring')
var registController = {
    telCheck: function (req, res) {
        var tel = req.body.tel
        registerDAO.telCheck(tel, function (err, results) {
            if (err) {
                res.json({ code: 500, data: 0, msg: '号码查询失败' })
            }
            else {
                console.log(results.length)
                if (results.length == 0 || results == null) {
                    var queryData = querystring.stringify({
                        "mobile": tel,  // 接受短信的用户手机号码
                        "tpl_id": "184607",  // 您申请的短信模板ID，根据实际情况修改
                        "tpl_value": "#code#=1235231",  // 您设置的模板变量，根据实际情况修改
                        "key": "dcf034f34def71e502b9436f580c548f",  // 应用APPKEY(应用详细页查询)
                    });
                    var queryUrl = 'http://v.juhe.cn/sms/send?' + queryData;
                    request(queryUrl,queryData, function (error, response, body) {
                        var code=querystring.parse(queryData).tpl_value.split('=')
                        if (!error && response.statusCode == 200) {
                            console.log(body) // 打印接口返回内容
                            var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
                            console.log(jsonObj)
                            res.json({ code: 200, data:code[1], msg: '信息已发送' })
                        } else {
                            console.log('请求异常');
                        }
                    })
                } else {
                    res.json({ code: 200, data: 0, msg: '号码已存在' })
                }
            }
        })
    },
    regist: function (req, res) {
        var userName = req.body.userName.trim()
        var password = req.body.password.trim()
        var tel = req.body.tel.trim()
        var registerTime = new Date()
        console.log(userName,password,tel)
        if (userName.length == 0 || password.length == 0 || tel.length == 0) {
            res.json({ code: 500, data: 0, msg: '用户名 密码 电话不能为空！' })
        } else {
            registerDAO.telCheck(tel, function (err, results) {
                if (err) {
                    res.json({ code: 500, data: 0, msg: '号码查询失败' })
                } else {
                    if (results == null || results.length == 0) {
                        var user = { userName, password, tel, registerTime }
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(user.password, salt, function (err, hash) {
                                // hash是加密后的字符
                                user.password = hash
                                registerDAO.register(user, function (err, results) {
                                    if (err) {
                                        res.status(500).json({data:0, msg: '数据库错误，注册失败!' })
                                    } else {
                                        if (results.affectedRows == 0) {
                                            res.status(200).json({ data: 0, msg: '注册失败' })
                                        } else {
                                            res.status(200).json({ data: 1, msg: '注册成功' })
                                        }
                                    }
                                })
                            });
                        });
                    }else{
                        res.json({code:200,data:0,msg:'该号码已注册'})
                    }
                }

            })
        
        }


    }
}
module.exports = registController