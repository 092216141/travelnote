var DAO = require('./DAO')
//针对用户数据操作的模块对象
var userDAO = {
    /**根据Id查询用户信息*/
    getUserInfo: function (userTel, callback) {
        DAO('select userName,sex,tel,headPic,email,address,registerTime from users where tel = ?', userTel, function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**用户修改个人信息 */
    updateUser: function (user, callback) {
        DAO('update users set userName = ?,sex =?,email=?,address=?,registerTime =? where tel = ?',
            [user.userName, user.sex, user.email, user.address, user.registerTime, user.userTel]
            , function (err, results) {
                if (err) {
                    callback(err, null)
                } else {
                    callback(null, results)
                }
            })
    },
    /**修改用户手机号 */
    updataTel:function (newTel, userId, callback) {
        console.log(newTel, userId)
        DAO('update users set tel = ? where userId = ?', [newTel, userId], function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**上传头像 */
    headPic: function (userHead, callback) {
        DAO('update users set headPic = ? where tel = ?', [userHead.headPic, userHead.userTel], function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**个人攻略列表列表 */
    userArticle: function (userId, callback) {
        DAO('select strategyId,type,title,ssInfo,cityName,ssLikeNum,ssCollectionNum,ssTime,ssStatus,cover from scenerystrategy where userId = ? and ssStatus != 3'
        +' UNION '+
        'select strategyId,type,title,fsInfo,cityName,fsLikeNum,fsCollectionNum,fsTime,fsStatus,cover from foodstrategy where userId = ? and fsStatus != 3'
        +' UNION '+
        'select strategyId,type,title,prInfo,cityName,prLikeNum,prCollectionNum,prTime,prStatus,cover from personalrow where userId = ? and prStatus != 3',[userId,userId,userId], function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**上传攻略 */
    commitArticle: function (sqlstr, ins, callback) {
        DAO(sqlstr, ins, function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**修改攻略 */
    updateArticle: function (sqlstr, upd, callback) {
        DAO(sqlstr, upd, function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**删除攻略 */
    delArticle: function (sqlstr, strategyId, callback) {
        DAO(sqlstr, strategyId, function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**景点收藏查询 */
    /**攻略收藏查询 */
    collectArticle: function (userId,type, callback) {
        // var sqlstr = ""
        // switch (type) {
        //     case 'scenerystrategy': sqlstr = "select * from collections c join personalrow p on c.strategyId = p.strategyId where c.userId = ?"; var ins = [type, title, cover, article, cityName, userId, insertTime]; break;
        //     case 'foodstrategy': sqlstr = 'select * from collections c join scenerystrategy s on c.strategyId = s.strategyId where c.userId ='; var ins = [type, title, cover, article, cityName, userId, insertTime]; break;
        //     case 'personalrow': sqlstr = 'insert into personalrow (type,title,cover,dayNum,season,crowdType,prInfo,userId,prTime) values (?,?,?,?,?,?,?,?,?)'; var ins = [type, title, cover, dayNum, season, crowdType, article, userId, insertTime]; break;
        //     default: console.log('没有该类型');
        // }
        // DAO('select * from collections where userId = ?', userId, function (err, results) {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         callback(null, results)
        //     }
        // })
    },
    /**关注列表添加 */
    addFriends: function (userId, relationUserId, callback) {
        DAO('insert into relationship (userId,relationUserId) values ((select userId from users where tel = ?),?)', [userId, relationUserId], function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**粉丝列表查询 */
    fans: function (userId, callback) {
        DAO('select relationUserId from relationship where userId = ?', userId, function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**关注列表查询 */
    attentions: function (userId, callback) {
        DAO('select userId from relationship where relationUserId = ?', userId, function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**查询用户评论 */
    comments: function (userId, callback) {
        DAO('select * from comments where userId = ?', userId, function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**查询用户评论回复 */
    replys: function (userId, callback) {
        DAO('select * from replys where userId = ?', userId, function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    /**系统消息查询 */
    sysMessage: function (userId, callback) {
        DAO('select * from sysmessage where userId = ?', userId, function (err, results) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, results)
            }
        })
    },
    sysMessageNum:function(userId,callback){
        DAO('select count(*) Num from sysmessage where userId=? and msStatus=0',userId,function(err,results){
            if(err){
                callback(err,null)
            }else{
                callback(null,results)
            }
        })
    }
}
module.exports = userDAO