/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const QuestionModel = Models.QuestionModel;
const QuestionAPI = new Base({
  model: QuestionModel,
  search: 'title'
})

QuestionAPI.create = QuestionAPI.addSchedule;

export default QuestionAPI
