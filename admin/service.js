/**
 * @author jk
 * @version 1.0.0
 */

import $     from '../utils';
import qiniu from 'qiniu';

qiniu.conf.ACCESS_KEY = $.config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = $.config.qiniu.SECRET_KEY;

export default {
  uptoken: function (req, res, next) {
    const putPolicy = new qiniu.rs.PutPolicy($.config.qiniu.bucket);
    res.json({ uptoken: putPolicy.token() });
  }
}

