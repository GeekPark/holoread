/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'
import Base   from './base'


const {CommentModel} = Models;

export default new Base({
  model: CommentModel,
})


