/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const AnswerModel = Models.AnswerModel;
const AnswerAPI = new Base({
  model: AnswerModel,
  search: 'title'
})

export default AnswerAPI
