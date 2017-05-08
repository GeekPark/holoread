/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const LogModel = Models.LogModel;
const LogAPI   = new Base(LogModel);

export default LogAPI
